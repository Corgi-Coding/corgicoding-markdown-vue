# corgicoding-markdown-vue

Vue components based on monaco and markdown-it.

## how to use

First, you need to install this package on your project.

``` powershell
$ npm install @corgicoding/markdown-vue
```

After that, you can import it globally in main.js.

``` js
import markdownVue from "@corgicoding/markdown-vue";
createApp(App).use(markdownVue).mount('#app');
```

### on demand Import

Of course, you can import on demand in the following ways

- markdownVue

``` js
import markdownVue from "@corgicoding/markdown-vue/src/index.vue";
```

- editorPage

``` js
import markdownVue from "@corgicoding/markdown-vue/src/components/Monaco.vue";
```

- renderPage

### dev

sometimes, you should install `monaco-editor-webpack-plugin` ,

``` json
  "devDependencies": {
    "monaco-editor-webpack-plugin": "^4.1.1"
  },
```

and add the following code in `vue.config.js`

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

## Vue

this component has the following props:

- option 
  - markdown-it options
- content
  - init content
- editFlag
  - control editPage show
- hasToolBar
  - control toolBar show

``` js
    options: {
      type: Object,
    },
    /* text to be rendered */
    content: {
      type: String,
      default: "",
    },
    editFlag: {
      type: Boolean,
      default: true,
    },
    hasToolBar: {
      type: Boolean,
      default: true,
    },
```


