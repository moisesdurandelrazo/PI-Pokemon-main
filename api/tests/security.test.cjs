const { test } = require('node:test');
const assert = require('node:assert/strict');
const { credentials, pokemonInput, pagination, hashPassword, verifyPassword, equal, rateLimit } = require('../src/security');
test('passwords are salted and verified; malformed credentials are rejected', async () => {
  const password = 'a secure password';
  const first = await hashPassword(password), second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword('incorrect password', first), false);
  assert.equal(credentials({ email: { $ne: null }, password }), null);
  assert.equal(credentials({ email: 'a@b.com', password: 'short' }), null);
  assert.equal(credentials({ email: 'a@b.com', password: 'é'.repeat(65) }), null);
  assert.equal(equal('é'.repeat(64), 'a'.repeat(64)), false);
});
test('pagination rejects unbounded, structured, duplicate and injected parameters', () => {
  assert.deepEqual(pagination({}), { currentPage: 1, perPage: 12, offset: 0 });
  for (const query of [{ perPage: '1000000' }, { perPage: ['12','12'] }, { currentPage: '0' }, { perPage: '1&limit=10000' }, { currentPage: {} }]) assert.equal(pagination(query), null);
});
test('Pokemon creation uses an allowlist and validates every field', () => {
  const body = { name: 'Pikachu', hp: 0, attack: 1, defense: 1, speed: 1, height: 1, weigth: 1, types: ['electric'], id: 'injected' };
  assert.equal(pokemonInput(body).values.id, undefined);
  for (const patch of [{ hp: -1 }, { hp: '5' }, { hp: 100001 }, { name: {} }, { types: ['electric','electric'] }, { types: { $ne: null } }]) assert.equal(pokemonInput({ ...body, ...patch }), null);
});
test('rate limiter rejects bursts', () => {
  const limit = rateLimit(2, 60000);
  let passed = 0, status;
  const res = { set() {}, status(code) { status = code; return this; }, json() {} };
  for (let i=0;i<3;i++) limit({ ip: 'test' }, res, () => passed++);
  assert.equal(passed, 2); assert.equal(status, 429);
});
const { Writable } = require('node:stream');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const sessions = new Map(), users = new Map();
const dbPath = path.resolve(__dirname, '../src/db.js');
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: {
  User: {
    async findOne({ where }) { return [...users.values()].find(u => u.email === where.email); },
    async create(values) { const u = { id: String(users.size + 1), ...values }; users.set(u.id, u); return u; },
    async findByPk(id) { return users.get(id); },
  },
  Session: {
    async create(values) { const s = { ...values, async destroy() { sessions.delete(this.id); } }; sessions.set(s.id, s); return s; },
    async findByPk(id) { return sessions.get(id); },
    async destroy({ where }) { if (where.id) sessions.delete(where.id); },
  },
} };
process.env.CLIENT_URL_DEV = 'http://localhost:3000';
const express = require('express');
const { router, requireSession, requireCsrf, trustedWrite } = require('../src/auth');
// Exercise Express routing without opening a TCP port.
function request(method, url, { body = {}, cookie, csrf, origin = process.env.CLIENT_URL_DEV } = {}) {
  const app = express();
  app.use((req, res, next) => { req.body = body; req.cookies = cookie || {}; next(); });
  app.use('/auth', router);
  app.post('/protected', trustedWrite, requireSession, requireCsrf, (req, res) => res.json({ user: req.user }));
  return new Promise((resolve, reject) => {
    const req = new EventEmitter(); Object.assign(req, { method, url, headers: { origin, 'content-type': 'application/json', 'content-length': method === 'POST' && url === '/auth/logout' ? '0' : String(Buffer.byteLength(JSON.stringify(body))), ...(csrf ? { 'x-csrf-token': csrf } : {}) }, connection: { remoteAddress: '127.0.0.1' } });
    let output = ''; const headers = {};
    const res = new Writable({ write(chunk, encoding, done) { output += chunk; done(); } });
    res.end = res.end.bind(res);
    res.write = res.write.bind(res);
    Object.assign(res, { statusCode: 200, setHeader(k,v) { headers[k.toLowerCase()] = v; }, getHeader(k) { return headers[k.toLowerCase()]; }, removeHeader(k) { delete headers[k.toLowerCase()]; } });
    res.on('finish', () => resolve({ status: res.statusCode, headers, body: output ? JSON.parse(output) : null }));
    app.handle(req, res, reject);
  });
}
test('HTTP auth requires a session, trusted origin and CSRF, and revokes on logout', async () => {
  assert.equal((await request('POST', '/protected')).status, 401);
  assert.equal((await request('POST', '/auth/register', { origin: 'https://evil.example' })).status, 403);
  const registered = await request('POST', '/auth/register', { body: { email: 'test@example.com', password: 'my secure password' } });
  assert.equal(registered.status, 200);
  assert.equal(registered.body.user.passwordHash, undefined);
  const setCookie = [registered.headers['set-cookie']].flat()[0];
  assert.match(setCookie, /HttpOnly/);
  const [key, value] = setCookie.split(';')[0].split('=');
  const cookie = { [key]: value }, csrf = registered.body.csrfToken;
  assert.equal(sessions.has(value), false);
  assert.equal((await request('GET', '/auth/me', { cookie })).status, 200);
  assert.equal((await request('POST', '/protected', { cookie })).status, 403);
  assert.equal((await request('POST', '/protected', { cookie, csrf: 'wrong' })).status, 403);
  assert.equal((await request('POST', '/protected', { cookie, csrf })).status, 200);
  assert.equal((await request('POST', '/auth/logout', { cookie, csrf })).status, 204);
  assert.equal((await request('GET', '/auth/me', { cookie })).status, 401);
  assert.equal((await request('POST', '/auth/login', { body: { email: 'test@example.com', password: 'incorrect password' } })).status, 401);
  const login = await request('POST', '/auth/login', { body: { email: 'test@example.com', password: 'my secure password' } });
  assert.equal(login.status, 200);
  const [newKey, newValue] = [login.headers['set-cookie']].flat()[0].split(';')[0].split('=');
  for (const session of sessions.values()) session.expiresAt = new Date(0);
  assert.equal((await request('GET', '/auth/me', { cookie: { [newKey]: newValue } })).status, 401);
});
