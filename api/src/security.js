const { randomBytes, createHash, scrypt, timingSafeEqual } = require("node:crypto");
const { promisify } = require("node:util");
const derive = promisify(scrypt);
const token = () => randomBytes(32).toString("hex");
const digest = value => createHash("sha256").update(value).digest("hex");
let hashing = 0;
async function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  if (hashing >= 4) throw Object.assign(new Error("Inténtalo más tarde"), { status: 429 });
  hashing++;
  try { return `${salt}:${(await derive(password, salt, 64)).toString("hex")}`; }
  finally { hashing--; }
}
async function verifyPassword(password, stored) {
  const [salt] = stored.split(":");
  const actual = await hashPassword(password, salt);
  return equal(actual, stored);
}
function equal(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
function credentials(body) {
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") return null;
  const email = body.email.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.password.length < 12 || Buffer.byteLength(body.password) > 128) return null;
  return { email, password: body.password };
}
function pokemonInput(body) {
  if (!body || typeof body.name !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(body.name)) return null;
  const result = { name: body.name.toLowerCase() };
  for (const field of ["hp", "attack", "defense", "speed", "height", "weigth"]) {
    if (!Number.isInteger(body[field]) || body[field] < 0 || body[field] > 100000) return null;
    result[field] = body[field];
  }
  if (!Array.isArray(body.types) || body.types.length < 1 || body.types.length > 2 || new Set(body.types).size !== body.types.length || body.types.some(t => typeof t !== "string" || !/^[a-z-]{1,30}$/.test(t))) return null;
  return { values: result, types: body.types };
}
function pagination(query) {
  const page = query.currentPage === undefined ? "1" : query.currentPage;
  const limit = query.perPage === undefined ? "12" : query.perPage;
  if (!/^\d{1,5}$/.test(page) || !/^\d{1,3}$/.test(limit) || typeof page === "object" || typeof limit === "object") return null;
  const currentPage = Number(page), perPage = Number(limit);
  return currentPage >= 1 && currentPage <= 10000 && perPage >= 1 && perPage <= 50 ? { currentPage, perPage, offset: (currentPage - 1) * perPage } : null;
}
function rateLimit(max, windowMs) {
  const entries = new Map();
  return (req, res, next) => {
    const now = Date.now();
    for (const [key, entry] of entries) if (entry.until <= now) entries.delete(key);
    let entry = entries.get(req.ip);
    if (!entry) {
      if (entries.size >= 10000) return res.status(429).json({ msg: "Inténtalo más tarde" });
      entry = { count: 0, until: now + windowMs }; entries.set(req.ip, entry);
    }
    if (++entry.count > max) {
      res.set("Retry-After", String(Math.ceil((entry.until - now) / 1000)));
      return res.status(429).json({ msg: "Demasiadas solicitudes" });
    }
    next();
  };
}
module.exports = { token, digest, hashPassword, verifyPassword, equal, credentials, pokemonInput, pagination, rateLimit };
