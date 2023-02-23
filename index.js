const { parse } = require('path');

class CustomImportPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('CustomImportPlugin', (factory) => {
      factory.hooks.parser.for('javascript/auto').tap('CustomImportPlugin', (parser) => {
        parser.hooks.import.tap('CustomImportPlugin', (statement, source) => {
          // 获取导入模块的路径和导入变量的名称
          const request = source.value;
          const { dir, name, ext } = parse(request);

          // 如果导入的是一个.txt文件，则将其改为.js后缀，并导入该JavaScript模块
          if (ext === '.txt') {
            const newRequest = `${dir}/${name}.js`;
            parser.parse(`import ${statement.importClause} from '${newRequest}';`);
            return true;
          }
        });
      });
    });
  }
}

module.exports = CustomImportPlugin;
