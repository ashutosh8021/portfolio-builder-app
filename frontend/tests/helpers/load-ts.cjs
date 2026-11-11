const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

module.exports = function loadTs(file, dependencies, globals = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../../src', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      experimentalDecorators: true
    }
  });
  const exports = {};
  const sandbox = {
    exports, module: { exports }, console,
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    ...globals
  };
  vm.runInNewContext(outputText, sandbox);
  return sandbox.module.exports;
};
