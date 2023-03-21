const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin

class ImportCdnJsonPlugin {
  constructor(options) {
    this._options = options || {}
  }

  apply(compiler) {
    let found = compiler.options.plugins.find(plugin => {
      return plugin instanceof ModuleFederationPlugin
    })
    let remotes = {};
    if (found) {
      remotes = found._options?.remotes || {}
    }
    Object.keys(this._options).forEach(key => {
      let url = this._options[key];
      remotes[key] = `promise new Promise(function (resolve) {
          window.__zz_json_maps_cache__ = window.__zz_json_maps_cache__ || {};
          let data = null;
          if(window.__zz_json_maps_cache__['${url}']){
            data = window.__zz_json_maps_cache__['${url}'];
            resolve({
              get () {
                return function () {
                  return data
                }
              }
            })
          }else{
            window.fetch('${url}').then(res=>res.json()).then(result=>{
              window.__zz_json_maps_cache__['${url}'] = result;
              resolve({
                get () {
                  return function () {
                    return result;
                  }
                }
              })
            }).catch((err)=>{
              console.error('request ${url} error',err);
            })
          }
        })`
    })
    if (!found){
      let mfInstance = new ModuleFederationPlugin({
        name: 'ZZRemoteJson',
        remotes
      })
      mfInstance.apply(compiler)
    }
  }
}

module.exports = ImportCdnJsonPlugin
