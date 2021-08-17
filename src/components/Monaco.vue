<template>
  <div class="monaco-container">
    <div ref="container" class="monaco-editor"></div>
  </div>
</template>

<script>
import * as monaco from "monaco-editor";

export default {
  name: "editPage",
  props: {
    hasInitContent: {
      type: Boolean,
      default: false,
    },
    // 编辑器中呈现的内容
    codes: {
      type: String,
      default: function () {
        return "";
      },
    },
    // 主要配置
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
    // 編輯器配置
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
  mounted() {
    if (this.hasInitContent) {
      const timeout = setInterval(() => {
        if (this.codes !== "") {
          this.monacoEditor = monaco.editor.create(this.$refs.container, {
            value: this.codes, // 见props
            language: this.codeOption.lang,
            theme: this.codeOption.theme, // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
            editorOptions: this.editorOptions, // 同codes
            minimap: {
              enabled: this.codeOption.minimap,
            },
            scrollbar: {
              // Subtle shadows to the left & top. Defaults to true.
              useShadows: false,

              // more see https://github.com/microsoft/monaco-editor/blob/main/test/playground.generated/customizing-the-appearence-scrollbars.html

              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            automaticLayout: true, // 自动布局
            wordWrap: "on",
          });

          this.monacoEditor.getModel().onDidChangeContent(() => {
            this.$emit("contentChange", this.monacoEditor.getValue());
            this.monacoEditor.layout();
          });

          this.monacoEditor.onDidScrollChange(() => {
            const scrollInf = {
              height: this.monacoEditor.getScrollHeight(),
              top: this.monacoEditor.getScrollTop(),
            };
            this.$emit("editScroll", scrollInf);
          });
          clearInterval(timeout);
        }
      }, 100);
    } else {
      console.warn("corgicoding:", "no content init");
      this.monacoEditor = monaco.editor.create(this.$refs.container, {
        language: this.codeOption.lang,
        theme: this.codeOption.theme, // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        editorOptions: this.editorOptions, // 同codes
        minimap: {
          enabled: this.codeOption.minimap,
        },
        scrollbar: {
          // Subtle shadows to the left & top. Defaults to true.
          useShadows: false,

          // more see https://github.com/microsoft/monaco-editor/blob/main/test/playground.generated/customizing-the-appearence-scrollbars.html

          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        automaticLayout: true, // 自动布局
        wordWrap: "on",
      });

      this.monacoEditor.getModel().onDidChangeContent(() => {
        this.$emit("contentChange", this.monacoEditor.getValue());
        this.monacoEditor.layout();
      });

      this.monacoEditor.onDidScrollChange(() => {
        const scrollInf = {
          height: this.monacoEditor.getScrollHeight(),
          top: this.monacoEditor.getScrollTop(),
        };
        this.$emit("editScroll", scrollInf);
      });
    }
  },

  methods: {
    setScrollTop(temp) {
      const height = temp.height;
      const top = temp.top;
      const clientHeight = temp.clientHeight;
      const percent = (top / height).toFixed(2);

      this.monacoEditor.setScrollPosition({
        scrollTop:
          (this.monacoEditor.getScrollHeight() - clientHeight) * percent,
      });
    },

    insertVal(insertContent, type) {
      const beforeIndex = {
        startLineNumber: this.monacoEditor.getSelection().startLineNumber,
        startColumn: this.monacoEditor.getSelection().startColumn,
        endLineNumber: this.monacoEditor.getSelection().startLineNumber,
        endColumn: this.monacoEditor.getSelection().startColumn,
      };

      const endIndex = {
        startLineNumber: this.monacoEditor.getSelection().endLineNumber,
        startColumn: this.monacoEditor.getSelection().endColumn,
        endLineNumber: this.monacoEditor.getSelection().endLineNumber,
        endColumn: this.monacoEditor.getSelection().endColumn,
      };
      if (type === "symmetry") {
        this.insertEdit(endIndex, insertContent);
        this.insertEdit(beforeIndex, insertContent);
      } else if (type === "asymmetric") {
        this.insertEdit(endIndex, insertContent[1]);
        this.insertEdit(beforeIndex, insertContent[0]);
      } else {
        this.insertEdit(beforeIndex, insertContent);
      }
    },

    insertEdit(range, text) {
      this.monacoEditor.executeEdits("", [
        {
          range: range,
          text: text,
          forceMoveMarkers: true,
        },
      ]);
    },

    resetContent(type) {
      this.monacoEditor.trigger("", type);
    },
  },
};
</script>

<style scoped>
.monaco-container {
  width: 100%;
  height: 100%;
}
.monaco-editor {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}
</style>
