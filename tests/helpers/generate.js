const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');
const handlebars = require('handlebars');

function loadGenerator(portfolio, configureArchive = () => {}) {
  const files = {};
  const archive = new EventEmitter();
  archive.append = (content, { name }) => { files[name] = content; };
  archive.finalize = async () => {
    queueMicrotask(() => {
      archive.emit('data', Buffer.from('archive'));
      archive.emit('end');
    });
  };
  configureArchive(archive);
  const sandbox = {
    exports: {}, Buffer,
    process: { env: {} },
    console: { error() {} },
    require(name) {
      if (name === 'handlebars') return handlebars;
      if (name === 'archiver') return () => archive;
      if (name === '@supabase/supabase-js') return {
        createClient: () => ({
          from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: portfolio }) }) }) })
        })
      };
      throw new Error(`Unexpected dependency: ${name}`);
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../netlify/functions/portfolio-generate.js'), 'utf8'), sandbox);
  return { handler: sandbox.exports.handler, files };
}

module.exports = { loadGenerator };
