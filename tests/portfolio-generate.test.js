const assert = require('node:assert/strict');
const test = require('node:test');
const { loadGenerator } = require('./helpers/generate');

test('includes saved profile and project photos in exported HTML', async () => {
  const { handler, files } = loadGenerator({
    id: 1, name: 'Sample Person', title: 'Developer',
    profile_photo: 'data:image/png;base64,cHJvZmlsZQ==',
    projects: [{ name: 'Demo', description: 'A project', image: 'data:image/png;base64,cHJvamVjdA==' }]
  });
  const response = await handler({ httpMethod: 'POST', body: '{"portfolioId":1}' });
  assert.equal(response.statusCode, 200);
  assert.match(files['index.html'], /<img[^>]+src="data:image\/png;base64,cHJvZmlsZQ&#x3D;&#x3D;"/);
  assert.match(files['index.html'], /<img[^>]+src="data:image\/png;base64,cHJvamVjdA&#x3D;&#x3D;"/);
});

test('omits image elements when a portfolio has no photos', async () => {
  const { handler, files } = loadGenerator({
    id: 1, name: 'Sample Person', profile_photo: null,
    projects: [{ name: 'Demo', image: null }]
  });
  await handler({ httpMethod: 'POST', body: '{"portfolioId":1}' });
  assert.doesNotMatch(files['index.html'], /<img/);
});
