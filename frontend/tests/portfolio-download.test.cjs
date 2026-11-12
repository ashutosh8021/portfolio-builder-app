const assert = require('node:assert/strict');
const test = require('node:test');
const loadTs = require('./helpers/load-ts.cjs');

function setup(saveResult = { id: 42 }, saveError = null) {
  const calls = [];
  const downloads = [];
  const { PortfolioService } = loadTs('app/services/portfolio.service.ts', {
    '@angular/core': { Injectable: () => target => target },
    rxjs: { BehaviorSubject: class { constructor(value) { this.value = value; } next(value) { this.value = value; } } },
    '../../environments/environment': { environment: { apiUrl: '/api' } }
  }, {
    Blob,
    console: { error() {} },
    window: { URL: { createObjectURL: () => 'blob:download', revokeObjectURL() {} } },
    document: { createElement: () => ({ click() { downloads.push(this.download); } }) }
  });
  const service = new PortfolioService({
    post(url, body) {
      calls.push({ url, body: JSON.parse(JSON.stringify(body)) });
      return { async toPromise() {
        if (url.endsWith('/portfolio-save')) {
          if (saveError) throw saveError;
          return saveResult;
        }
        return new Blob(['zip']);
      } };
    }
  });
  return { service, calls, downloads };
}

test('downloads an unsaved preview after saving it and obtaining its ID', async () => {
  const { service, calls, downloads } = setup();
  const portfolio = { name: 'Sample Person', socialLinks: { github: 'https://github.com/example' } };
  await service.downloadPortfolio(portfolio);
  assert.deepEqual(calls.map(call => call.url), ['/api/portfolio-save', '/api/portfolio-generate']);
  assert.deepEqual(calls[1].body, { portfolioId: 42 });
  assert.equal(portfolio.id, 42);
  assert.equal(portfolio.socialLinks.github, 'https://github.com/example');
  assert.deepEqual(downloads, ['Sample_Person_portfolio.zip']);
});

test('an explicit save retains the ID so downloading does not save a duplicate', async () => {
  const { service, calls } = setup();
  const portfolio = { name: 'Demo' };
  await service.savePortfolio(portfolio);
  assert.equal(portfolio.id, 42);
  await service.downloadPortfolio(portfolio);
  assert.equal(calls.filter(call => call.url.endsWith('/portfolio-save')).length, 1);
});

test('a previously saved portfolio downloads without another save', async () => {
  const { service, calls } = setup();
  await service.downloadPortfolio({ id: 7, name: 'Demo' });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].body, { portfolioId: 7 });
});

test('failed saving prevents an export request', async () => {
  const { service, calls, downloads } = setup(null, new Error('Save failed'));
  await assert.rejects(service.downloadPortfolio({ name: 'Demo' }), /Save failed/);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/portfolio-save');
  assert.equal(downloads.length, 0);
});

test('a save response without an ID cannot trigger an invalid export', async () => {
  const { service, calls } = setup({});
  await assert.rejects(service.downloadPortfolio({ name: 'Demo' }), /ID/);
  assert.equal(calls.length, 1);
});
