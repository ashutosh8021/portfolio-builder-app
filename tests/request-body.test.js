const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

for (const name of ['portfolio-save', 'portfolio-generate']) {
  function load() {
    let databaseCalls = 0;
    const sandbox = {
      exports: {}, process: { env: {} }, console: { error() {} },
      require(dependency) {
        if (dependency === '@supabase/supabase-js') return {
          createClient: () => ({ from() { databaseCalls++; throw new Error('Database unavailable'); } })
        };
        return require(dependency);
      }
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, `../netlify/functions/${name}.js`), 'utf8'), sandbox);
    return { handler: sandbox.exports.handler, databaseCalls: () => databaseCalls };
  }

  test(`${name} rejects malformed JSON and non-object bodies before database access`, async () => {
    const { handler, databaseCalls } = load();
    for (const body of [undefined, '', '{', 'null', '[]', '42', '"text"']) {
      const response = await handler({ httpMethod: 'POST', body });
      assert.equal(response.statusCode, 400, `body: ${body}`);
      assert.equal(typeof JSON.parse(response.body).error, 'string');
    }
    assert.equal(databaseCalls(), 0);
  });

  test(`${name} continues reporting database failures as server errors`, async () => {
    const { handler, databaseCalls } = load();
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ portfolioId: 1, name: 'Demo', title: 'Developer', email: 'demo@example.com', bio: 'Demo' })
    });
    assert.equal(response.statusCode, 500);
    assert.equal(databaseCalls(), 1);
  });
}
