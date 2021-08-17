# corgicoding-markdown-vue
Vue components based on monaco and markdown-it

## how to use

``` js

import markdownVue from "@corgicoding/markdown-vue";
createApp(App).use(markdownVue).mount('#app');

```

### dev

``` json
  "devDependencies": {
    "monaco-editor-webpack-plugin": "^4.1.1"
  },
```

#### vue.config.js

``` js
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  // ......
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: [
          "javascript",
          "css",
          "html",
          "typescript",
          "json",
          "markdown",
        ],
      }),
    ],
  },
};
```