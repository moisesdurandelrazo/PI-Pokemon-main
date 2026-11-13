const test = require('node:test');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { spawnSync } = require('node:child_process');
const requireFromAjv = createRequire(require.resolve('ajv'));

test('Ajv resolves the maintained URI implementation', () => {
  const implementation = requireFromAjv('uri-js/package.json');
  assert.equal(implementation.name, 'fast-uri');
  assert.equal(implementation.version, '4.2.3');
});

test('Unicode separators finish normalization and resolution within a process timeout', () => {
  // Isolate the regression: a synchronous infinite loop cannot be stopped by a test timer.
  const result = spawnSync(process.execPath, ['--max-old-space-size=64', '-e', `
    const assert = require('node:assert/strict');
    const uri = require(${JSON.stringify(requireFromAjv.resolve('uri-js'))});
    for (const separator of ['\\u2028', '\\u2029']) {
      for (const path of [separator + 'segment', '/' + separator + 'segment/../end']) {
        const options = { iri: true, unicodeSupport: true };
        assert.equal(typeof uri.normalize('https://example.com/' + path, options), 'string');
        assert.equal(typeof uri.resolve('https://example.com/base/', path, options), 'string');
      }
    }
  `], { timeout: 3000, encoding: 'utf8', maxBuffer: 65536 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});

test('Ajv still resolves local fragments and relative external schema references', () => {
  const Ajv = require('ajv');
  const ajv = new Ajv();
  ajv.addSchema({ $id: 'https://example.com/schemas/types.json', definitions: { name: { type: 'string', minLength: 1 } } });
  const validate = ajv.compile({
    $id: 'https://example.com/schemas/pokemon.json',
    type: 'object', required: ['name', 'id'],
    properties: { name: { $ref: './types.json#/definitions/name' }, id: { $ref: '#/definitions/id' } },
    definitions: { id: { type: 'integer', minimum: 1 } },
  });
  assert.equal(validate({ name: 'Pikachu', id: 25 }), true);
  assert.equal(validate({ name: '', id: 25 }), false);
  assert.equal(validate({ name: 'Pikachu', id: -1 }), false);
});

test('ESLint validates rule options and reports source errors', async () => {
  const { ESLint } = require('eslint');
  const config = { rules: { 'no-unused-vars': ['error', { vars: 'all' }] } };
  const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: config });
  const [result] = await eslint.lintText('const unused = 1;');
  assert.equal(result.messages[0].ruleId, 'no-unused-vars');
  const invalid = new ESLint({ overrideConfigFile: true, overrideConfig: { rules: { 'no-unused-vars': ['error', { vars: 'invalid' }] } } });
  await assert.rejects(invalid.lintText('const unused = 1;'), /Key "no-unused-vars"/);
});
