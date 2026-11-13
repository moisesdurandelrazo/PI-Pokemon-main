import test from 'node:test';
import assert from 'node:assert/strict';
import { createPokemonClient } from '../src/auth/api.mjs';
const response = (data, status = 200) => ({ status, ok: status < 400, json: async () => data });
test('creation restores CSRF and uses cookies with redirect rejection', async () => {
  const calls = [];
  const client = createPokemonClient('/api', async (url, options) => {
    calls.push({ url, ...options });
    return response(url.endsWith('/auth/me') ? { csrfToken: 'token' } : { id: 1 });
  });
  await client.createPokemon({ name: 'pikachu' });
  assert.equal(calls[0].url, '/api/auth/me');
  assert.equal(calls[1].headers['X-CSRF-Token'], 'token');
  assert.equal(calls[1].credentials, 'include');
  assert.equal(calls[1].redirect, 'error');
});
test('missing CSRF prevents mutation', async () => {
  let requests = 0;
  const client = createPokemonClient('', async () => { requests++; return response({ user: {} }); });
  await assert.rejects(client.createPokemon({}), /validar la sesión/);
  assert.equal(requests, 1);
});
test('logout declares JSON and clears cached CSRF', async () => {
  const calls = [];
  const client = createPokemonClient('', async (url, options) => {
    calls.push({ url, ...options });
    return url.endsWith('logout') ? response(null, 204) : response({ csrfToken: 'token' });
  });
  await client.login('test@example.com', 'password');
  await client.logout();
  assert.equal(calls[1].headers['Content-Type'], 'application/json');
  await client.createPokemon({});
  assert.equal(calls[2].url, '/auth/me');
});
