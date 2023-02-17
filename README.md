# import-cdn-json-plugin
webpack插件，developer能够用同步的方式导入来自于cdn上的json文件

## 安装
```bash
npm install import-cdn-json-plugin -D
```

## 使用
```javascript
//webpack.config.js
const ImportCdnJsonPlugin = require('import-cdn-json-plugin');

module.exports = {
  plugins: [new ImportCdnJsonPlugin()],
};


//testModule.js
import json from 'https://www.test.com/cdn/configs.json'
export default function test(){
  console.log('cdn json->',json)
}
```
