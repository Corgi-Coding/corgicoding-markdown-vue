<template>
  <div class="c-html-render">
    <div ref="markdown-container" id="c-show-area"></div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import highlight from "highlight.js";
import "highlight.js/styles/github.css";

/* example: :pig: */
import emoji from "markdown-it-emoji";
/* example: H~2~O */
import subScript from "markdown-it-sub";
/* example: 29^th^ */
import supersScript from "markdown-it-sup";
/* ++instance++ */
import insert from "markdown-it-ins";
/*
  test footnote[^1]
  [^1]: Here is the footnote.
 */
import footNote from "markdown-it-footnote";

import "@corgicoding/theme";

export default {
  name: "RenderPage",
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
  data() {
    let markdown = new MarkdownIt(this.options)
      .use(emoji)
      .use(subScript)
      .use(supersScript)
      .use(insert)
      .use(footNote);
    return {
      markdown: markdown,
      hiddenRender: false,
    };
  },
  watch: {
    content: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs["markdown-container"].innerHTML =
            this.markdown.render(val);
          /*          const h1List = document.querySelectorAll(".c-html-render h1");
          console.log(h1List);
          const h2List = document.querySelectorAll(".c-html-render h2");
          console.log(h2List);*/
        });
      },
    },
  },
};
</script>

<style scoped></style>
