# corgicoding-markdown-vue

Vue components based on monaco and markdown-it.
Compatible with vue2 and vue3.

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

## Main Component

this component has the following props:

- option 
  - markdown-it options
- content
  - init content
- editFlag
  - control editPage show
- hasToolBar
  - control toolBar show
- darkMode
  - switch to dark theme


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
    darkMode: {
      type: Boolean,
      default: false
    }
```

### EditPage

on demand editpage props.

``` js
  props: {
    hasInitContent: {
      type: Boolean,
      default: false,
    },
    // editor show content
    codes: {
      type: String,
      default: function () {
        return "";
      },
    },
    // main config
    editorOptions: {
      type: Object,
      default: () => {
        return {
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false, // 只读
          cursorStyle: "line", // 光标样式
          glyphMargin: true, // 字形边缘
          useTabStops: false,
          fontSize: 16, // 字体大小
          autoIndent: false, // 自动布局
        };
      },
    },
    // editor config
    codeOption: {
      type: Object,
      default: () => {
        return {
          lang: "markdown",
          theme: "vs",
          minimap: false,
        };
      },
    },
  },
```

### RenderPage

on demand renderpage props.

``` js
  props: {
    options: {
      type: Object,
      /* default markdown-it options */
      default: () => {
        return {
          html: true,
          linkify: true,
          break: true,
          highlight: function (str, lang) {
            if (lang && highlight.getLanguage(lang)) {
              try {
                return (
                  '<pre class="hljs"><code>' +
                  highlight.highlight(lang, str, true).value +
                  "</code></pre>"
                );
                // eslint-disable-next-line no-empty
              } catch (__) {}
            }

            return (
              '<pre class="hljs"><code>' +
              highlight.highlight("json", str, true).value +
              "</code></pre>"
            ); // Use additional default escaping
          },
          // typographer:  true,
        };
      },
    },
    /* text to be rendered */
    content: {
      type: String,
      default: "> *corgicoding: Edit here...*",
    },
  },
```

## 1.0.5 UPDATE

1. modify toolbar css style.
2. support dark theme mode.
3. support export files.
