const ConcatSource = require('webpack-sources').ConcatSource;
const {Compilation} = require('webpack');
const pluginName = "ImportCdnJsonPlugin";

class ImportCdnJsonPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(ImportCdnJsonPlugin, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'MyPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS, // see below for more stages
        },
        (assets) => {
          console.log('List of assets and their sizes:');
          Object.entries(assets).forEach(([pathname, source]) => {
            console.log(`— ${pathname}: ${source.size()} bytes`);
          });
        }
      );
    // compiler.hooks.compilation.tap(pluginName, (compilation) => {
    //   compilation.hooks.buildModule.tap(pluginName, (module) => {
    //     console.log('在模块构建开始之前触发，可以用来修改模块');
    //     // console.log('module id',module.id);
    //     // console.log('module name',module.name);
    //     // console.log('module-->',Object.keys(module));
    //     // console.log('module buildInfo',module.buildInfo);
    //     // 获取模块源代码
    //     const source = module.originalSource().source();
    //     console.log('source-->',source)
    //     // 对源代码进行自定义处理
    //     // const newSource = `console.log("插入的代码");${source}`;
    //     // // 更新模块的源代码
    //     // module._source = new RawSource(newSource);
    //     // callback();
    //   })


      // compilation.hooks.optimizeChunkAssets.tapAsync(
      //   pluginName,
      //   (chunks, callback) => {
      //     chunks.forEach((chunk) => {
      //       chunk.files.forEach((file) => {
      //         if (file.endsWith('.js')) {
      //           const source = compilation.assets[file].source();
      //           console.log('source-->',source);
                // const processedSource = this.processImports(source);
                // compilation.assets[file] = {
                //   source: () => processedSource,
                //   size: () => processedSource.length,
                // };
        //       }
        //     });
        //   });
        //   callback();
        // },
      // );
    });
  }

  // async processImports(source) {
  //   const importRegexp = /import\s+(\w+)\s+from\s+'([^']+)';/g;
  //   const imports = {};
  //   let result;
  //   while ((result = importRegexp.exec(source))) {
  //     const [match, variable, path] = result;
  //     if (path.endsWith('.json')) {
  //       imports[variable] = path;
  //     }
  //   }
  //
  //   if (Object.keys(imports).length === 0) {
  //     return source;
  //   }
  //
  //   const processedImports = Promise.all(
  //     Object.entries(imports).map(([variable, path]) =>
  //       fetch(path).then((response) => response.json()),
  //     ),
  //   ).then((results) => {
  //     results.forEach((result, index) => {
  //       const [variable] = Object.entries(imports)[index];
  //       source = source.replace(
  //         new RegExp(`${variable}\\s*=\\s*require\\('${imports[variable]}'\\);`),
  //         `${variable} = ${JSON.stringify(result)};`,
  //       );
  //     });
  //     return source;
  //   });
  //
  //   const moduleWrapper = `
  //     async function () {
  //       await (${JSON.stringify(processedImports)});
  //       ${source}
  //     }
  //   `;
  //   return moduleWrapper;
  // }
}

module.exports = ImportCdnJsonPlugin;
