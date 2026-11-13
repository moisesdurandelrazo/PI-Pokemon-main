const { Router } = require("express");
const { Op } = require("sequelize");
const { User, Session } = require("./db");
const { token, digest, hashPassword, verifyPassword, equal, credentials, rateLimit } = require("./security");
const secure = process.env.NODE_ENV === "production";
const cookieName = secure ? "__Host-pokemon_session" : "pokemon_session";
const cookieOptions = { httpOnly: true, secure, sameSite: process.env.SESSION_SAME_SITE === "none" && secure ? "none" : "lax", path: "/" };
const lifetime = 8 * 60 * 60 * 1000;
const wrap = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const allowedOrigins = () => [process.env.CLIENT_URL_DEV, process.env.CLIENT_URL_PROD].filter(Boolean);
function trustedWrite(req, res, next) {
  if (!allowedOrigins().includes(req.get("origin"))) return res.status(403).json({ msg: "Origen no permitido" });
  if (req.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return res.status(415).json({ msg: "Se requiere application/json" });
  next();
}
const requireSession = wrap(async (req, res, next) => {
  const raw = req.cookies[cookieName];
  if (typeof raw !== "string" || !/^[a-f0-9]{64}$/.test(raw)) return res.status(401).json({ msg: "Inicia sesión" });
  const session = await Session.findByPk(digest(raw));
  if (!session || session.expiresAt <= new Date()) return res.status(401).json({ msg: "Sesión expirada" });
  const user = await User.findByPk(session.userId, { attributes: ["id", "email"] });
  if (!user) return res.status(401).json({ msg: "Inicia sesión" });
  req.user = { id: user.id, email: user.email }; req.session = session;
  next();
});
function requireCsrf(req, res, next) {
  if (!equal(req.get("X-CSRF-Token"), req.session.csrfToken)) return res.status(403).json({ msg: "Token CSRF inválido" });
  next();
}
async function startSession(req, res, user) {
  const previous = req.cookies[cookieName];
  if (typeof previous === "string" && /^[a-f0-9]{64}$/.test(previous)) await Session.destroy({ where: { id: digest(previous) } });
  await Session.destroy({ where: { expiresAt: { [Op.lte]: new Date() } } });
  const raw = token(), csrfToken = token();
  await Session.create({ id: digest(raw), userId: user.id, csrfToken, expiresAt: new Date(Date.now() + lifetime) });
  res.cookie(cookieName, raw, { ...cookieOptions, maxAge: lifetime });
  res.set("Cache-Control", "no-store").json({ user: { id: user.id, email: user.email }, csrfToken });
}
const router = Router();
router.use((req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
router.post(["/register", "/login"], rateLimit(10, 15 * 60 * 1000), trustedWrite, wrap(async (req, res) => {
  const input = credentials(req.body);
  if (!input) return res.status(400).json({ msg: "Correo o contraseña inválidos (12 caracteres y máximo 128 bytes)" });
  let user = await User.findOne({ where: { email: input.email } });
  if (req.path === "/register") {
    if (user) return res.status(409).json({ msg: "No se pudo registrar la cuenta" });
    try { user = await User.create({ email: input.email, passwordHash: await hashPassword(input.password) }); }
    catch (error) { if (error.name === "SequelizeUniqueConstraintError") return res.status(409).json({ msg: "No se pudo registrar la cuenta" }); throw error; }
  } else {
    // Perform the same expensive operation even when the account does not exist.
    const stored = user?.passwordHash || `${"0".repeat(32)}:${"0".repeat(128)}`;
    const valid = await verifyPassword(input.password, stored);
    if (!user || !valid) return res.status(401).json({ msg: "Correo o contraseña incorrectos" });
  }
  await startSession(req, res, user);
}));
router.get("/me", requireSession, (req, res) => res.json({ user: req.user, csrfToken: req.session.csrfToken }));
router.post("/logout", trustedWrite, requireSession, requireCsrf, wrap(async (req, res) => {
  await req.session.destroy(); res.clearCookie(cookieName, cookieOptions); res.sendStatus(204);
}));
module.exports = { router, trustedWrite, requireSession, requireCsrf, wrap };
