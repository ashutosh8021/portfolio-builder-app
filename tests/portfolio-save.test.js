const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '../netlify/functions/portfolio-save.js'),
  'utf8'
);

async function savePortfolio(fields) {
  let saved;
  const supabase = {
    from(table) {
      assert.equal(table, 'portfolios');
      return {
        insert([row]) {
          saved = { id: 'portfolio-1', ...row };
          return { select: () => ({ single: async () => ({ data: saved }) }) };
        },
        select() {
          return {
            eq(field, value) {
              assert.equal(field, 'id');
              assert.equal(value, saved.id);
              return { single: async () => ({ data: { ...saved, projects: [] } }) };
            }
          };
        }
      };
    }
  };
  const sandbox = {
    exports: {},
    process: { env: {} },
    console,
    require(name) {
      assert.equal(name, '@supabase/supabase-js');
      return { createClient: () => supabase };
    }
  };
  vm.runInNewContext(source, sandbox);
  const response = await sandbox.exports.handler({
    httpMethod: 'POST',
    body: JSON.stringify({
      name: 'Sample Person',
      title: 'Developer',
      email: 'sample@example.com',
      bio: 'Builds useful software.',
      projects: [],
      ...fields
    })
  });
  assert.equal(response.statusCode, 201);
  return JSON.parse(response.body);
}

const socialLinks = {
  github: 'https://github.com/example',
  linkedin: 'https://www.linkedin.com/in/example',
  twitter: 'https://twitter.com/example',
  website: 'https://example.com'
};

test('preserves social links in the nested shape submitted by the portfolio form', async () => {
  const portfolio = await savePortfolio({ socialLinks });
  assert.deepEqual(portfolio.social_links, socialLinks);
});

test('continues accepting legacy top-level social links', async () => {
  const portfolio = await savePortfolio(socialLinks);
  assert.deepEqual(portfolio.social_links, socialLinks);
});

test('prefers nested values, including an intentionally cleared link', async () => {
  const portfolio = await savePortfolio({
    ...socialLinks,
    socialLinks: { github: '', website: 'https://new.example.com' }
  });
  assert.deepEqual(portfolio.social_links, {
    ...socialLinks,
    github: '',
    website: 'https://new.example.com'
  });
});

test('defaults missing social links to empty strings', async () => {
  for (const fields of [{}, { socialLinks: null }]) {
    const portfolio = await savePortfolio(fields);
    assert.deepEqual(portfolio.social_links, {
      github: '', linkedin: '', twitter: '', website: ''
    });
  }
});
