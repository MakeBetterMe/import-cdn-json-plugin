const fetch = require('node-fetch');
const path = require('path');

class ImportCdnJsonPlugin {
  constructor(options) {
    this.options = options;
    this.jsonData = new Map();
  }

  apply(compiler) {
    // 在完成模块加载之后，为每个JSON文件提前获取内容
    compiler.hooks.compilation.tap('ImportCdnJsonPlugin', compilation => {
      compilation.hooks.finishModules.tapAsync('ImportCdnJsonPlugin', (modules, callback) => {
        // 遍历每个模块
        modules.forEach(module => {
          // 如果是JSON文件，则获取文件内容并保存到Map中
          if (module.type === 'json') {
            const url = module.userRequest;
            fetch(url).then(res => res.json()).then(json => {
              this.jsonData.set(url, json);
              callback();
            });
          }
        });
        callback();
      });
    });

    // 在生成Chunk时，将JSON内容打包为一个JavaScript模块
    compiler.hooks.emit.tapAsync('ImportCdnJsonPlugin', (compilation, callback) => {
      const content = `module.exports = ${JSON.stringify(Object.fromEntries(this.jsonData))};`;
      compilation.assets['json-data.js'] = {
        source: () => content,
        size: () => content.length
      };
      callback();
    });

    // 在模块执行前，替换JSON导入语句为对应的JSON内容
    compiler.hooks.normalModuleFactory.tap('ImportCdnJsonPlugin', factory => {
      factory.hooks.parser.for('javascript/auto').tap('ImportCdnJsonPlugin', parser => {
        parser.hooks.expression.for('CallExpression').tap('ImportCdnJsonPlugin', expr => {
          if (expr.callee.type === 'Import' && /\.json$/.test(expr.arguments[0].value)) {
            const url = expr.arguments[0].value;
            const jsonDataPath = path.resolve(__dirname, 'json-data.js');
            const replacement = `require('${jsonDataPath}')['${url}']`;
            const source = parser.state.current._source._value;
            parser.state.current._source._value = source.slice(0, expr.range[0]) + replacement + source.slice(expr.range[1]);
          }
        });
      });
    });
  }
}

module.exports = ImportCdnJsonPlugin;
