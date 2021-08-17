import MarkdownVue from "./index.vue";

MarkdownVue.install = (Vue) => {
  Vue.components(MarkdownVue.name, MarkdownVue);
};

export default MarkdownVue;
