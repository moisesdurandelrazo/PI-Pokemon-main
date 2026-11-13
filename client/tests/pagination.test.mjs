import test from 'node:test';
import assert from 'node:assert/strict';
import { getPageCount, normalizePokemonPage } from '../src/redux/actions/pagination.mjs';

const firstPage = Array.from({ length: 12 }, (_, index) => ({ id: index + 1 }));
const secondPage = Array.from({ length: 12 }, (_, index) => ({ id: index + 13 }));

test('uses catalogue total rather than the current page length', () => {
  const page = normalizePokemonPage({ data: firstPage, total: 1302 }, 1, 12);
  assert.equal(getPageCount(page.total, 1, page.data.length, 12), 109);
});

test('missing total keeps the next page available and does not invent a catalogue size', () => {
  const first = normalizePokemonPage({ data: firstPage }, 1, 12);
  assert.equal(first.total, null);
  assert.equal(getPageCount(first.total, 1, first.data.length, 12), 2);
  const second = normalizePokemonPage({ data: secondPage }, 2, 12);
  assert.equal(second.data[0].id, 13);
  assert.equal(getPageCount(second.total, 2, second.data.length, 12), 3);
});

test('accepts numeric metadata and legacy response shapes', () => {
  for (const metadata of [{ total: '1302' }, { totalPokemons: 1302 }, { count: 1302 }]) {
    assert.equal(normalizePokemonPage({ data: firstPage, ...metadata }, 1, 12).total, 1302);
  }
  assert.deepEqual(normalizePokemonPage(firstPage, 1, 12).data, firstPage);
});

test('infers the end only when a page without metadata is short or empty', () => {
  const last = normalizePokemonPage({ data: [{ id: 25 }] }, 3, 12);
  assert.equal(last.total, 25);
  assert.equal(getPageCount(last.total, 3, 1, 12), 3);
  const empty = normalizePokemonPage({ data: [] }, 3, 12);
  assert.equal(getPageCount(empty.total, 3, 0, 12), 2);
  assert.equal(getPageCount(0, 1, 0, 12), 1);
});

test('rejects invalid data and ignores invalid totals', () => {
  assert.throws(() => normalizePokemonPage({ error: 'offline' }, 1, 12), TypeError);
  for (const total of [NaN, Infinity, -1, '', {}, false]) {
    assert.equal(normalizePokemonPage({ data: firstPage, total }, 1, 12).total, null);
  }
});
