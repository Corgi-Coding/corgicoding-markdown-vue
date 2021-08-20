<template>
  <div class="c-default-size">
    <div
      style="width: 100%; height: 100%"
      id="c-markdown-container"
      :class="themeMode ? '' : 'dark'"
    >
      <div v-if="hasToolBar" class="c-tool-bar-area">
        <template v-for="item in toolBarList" :key="item.name">
          <div
            class="c-tool-item"
            :title="item.name"
            @click="insertFn(item.fn, item.type)"
          >
            <i :class="'icon iconfont ' + item.class"></i>
          </div>
        </template>
      </div>
      <div
        class="c-markdown"
        :style="hasToolBar ? 'height: calc(100% - 30px);' : 'height: 100%;'"
      >
        <!--   edit area   -->
        <div
          :class="
            !previewFlag
              ? 'c-edit-md-div c-border-tlb c-full-width'
              : 'c-edit-md-div c-border-tlb c-half-width'
          "
          v-if="editShow"
        >
          <div
            class="c-edit-border"
            @mouseover="setEditScrollFlag(true)"
            @mouseleave="setEditScrollFlag(false)"
          >
            <!--          <editPage :content="text"></editPage>-->
            <Monaco
              :codes="text"
              @contentChange="contentChange"
              @editScroll="editScroll"
              @export="exportFiles"
              ref="editPage"
              :hasInitContent="hasInitContentFlag"
            ></Monaco>
          </div>
        </div>
        <!--   render area   -->
        <div
          v-show="previewFlag"
          :class="
            editShow
              ? 'c-show-md-div c-border-tlb c-border-r c-half-width'
              : 'c-show-md-div c-full-width'
          "
          ref="renderShowArea"
          @mouseover="setRenderScrollFlag(true)"
          @mouseleave="setRenderScrollFlag(false)"
          @scroll="renderScroll()"
        >
          <!--        -->
          <RenderPage ref="renderPage" :content="text"></RenderPage>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@corgicoding/theme/dist/normalize.css";
import "./style/base.markdown.min.css";

import "./assets/icon/iconfont.css";

import RenderPage from "./components/RenderPage";
import Monaco from "./components/Monaco";

export default {
  name: "corgicoding-markdown",
  components: {
    Monaco,
    RenderPage,
  },
  props: {
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
      default: false,
    },
  },
  data() {
    return {
      themeMode: false,
      hiddenRender: false,
      text: "",
      hasInitContentFlag: this.content.length > 0,
      editScrollFlag: false,
      renderScrollFlag: false,
      fullscreen: false,

      previewFlag: true,
      editShow: true,

      toolBarList: [
        {
          fn: "## ",
          type: "before",
          name: "标题",
          class: "iconzitibiaoti",
        },
        {
          fn: "**",
          type: "symmetry",
          name: "加粗",
          class: "iconzitijiacu",
        },
        {
          fn: "*",
          type: "symmetry",
          name: "斜体",
          class: "iconzitixieti",
        },
        {
          fn: ["<u>", "</u>"],
          type: "asymmetric",
          name: "下划线",
          class: "iconzitixiahuaxian",
        },
        {
          fn: "~~",
          type: "symmetry",
          name: "删除线",
          class: "iconzitishanchuxian",
        },
        {
          fn: ["[", "]()"],
          type: "asymmetric",
          name: "链接",
          class: "iconcharulianjie",
        },
        {
          fn: ["![", "]()"],
          type: "asymmetric",
          name: "图片",
          class: "icontupiantianjia",
        },
        {
          fn: "1. ",
          type: "before",
          name: "有序列表",
          class: "iconyouxupailie",
        },
        {
          fn: "* ",
          type: "before",
          name: "无序列表",
          class: "iconwuxupailie",
        },
        {
          fn: "> ",
          type: "before",
          name: "引用",
          class: "iconyinyong",
        },
        {
          fn: "\n```\n",
          type: "symmetry",
          name: "代码块",
          class: "iconzitidaima",
        },
        {
          fn: ":pig:",
          type: "before",
          name: "emoji表情",
          class: "iconxiaolian",
        },
        {
          fn:
            "| Syntax      | Description |\n" +
            "| ----------- | ----------- |\n" +
            "| Header      | Title       |\n" +
            "| Paragraph   | Text        |\n",
          type: "before",
          name: "表格",
          class: "iconbiaodanzujian-biaoge",
        },
        {
          fn: "\n***\n",
          type: "before",
          name: "分割线",
          class: "iconfengexian",
        },
        {
          fn: "theme",
          type: "Instruction",
          name: "夜间模式",
          class: "icontiaoshi",
        },
        {
          fn: "undo",
          type: "Instruction",
          name: "撤销",
          class: "iconshangyibu",
        },
        {
          fn: "redo",
          type: "Instruction",
          name: "重做",
          class: "iconxiayibu",
        },
        {
          fn: "editShow",
          type: "Instruction",
          name: "编辑区可视化",
          class: "iconshebeikaifa",
        },
        {
          fn: "preview",
          type: "Instruction",
          name: "预览",
          /*"iconzitiyulan"*/
          class: "iconmiwen",
        },
        {
          fn: "fullscreen",
          type: "Instruction",
          name: "全屏",
          class: "iconquanping",
        },
      ],
    };
  },
  watch: {
    content: {
      immediate: true,
      handler(val) {
        this.text = val;
      },
    },
  },
  mounted() {
    this.editShow = this.editFlag;
    this.themeMode = !this.darkMode;
  },
  methods: {
    switchTheme() {
      this.themeMode = !this.themeMode;
    },
    contentChange(newContent) {
      this.text = newContent;
    },
    editScroll(inf) {
      if (this.editScrollFlag) {
        const height = inf.height - this.$refs.renderShowArea.clientHeight;
        const top = inf.top;

        const percent = (top / height).toFixed(2);
        this.$refs.renderShowArea.scrollTop =
          this.$refs.renderShowArea.scrollHeight * percent;
      }
    },
    setEditScrollFlag(target) {
      if (this.editScrollFlag !== target) {
        this.editScrollFlag = target;
      }
    },
    setRenderScrollFlag(target) {
      if (this.renderScrollFlag !== target && this.editShow) {
        this.renderScrollFlag = target;
      }
    },
    renderScroll() {
      if (this.renderScrollFlag && this.editShow) {
        const inf = {
          height: this.$refs.renderShowArea.scrollHeight,
          top: this.$refs.renderShowArea.scrollTop,
          clientHeight: this.$refs.renderShowArea.clientHeight,
        };
        this.$refs.editPage.setScrollTop(inf);
      }
    },
    insertFn(content, type) {
      if (type !== "Instruction") {
        this.$refs.editPage.insertVal(content, type);
      } else {
        switch (content) {
          case "fullscreen":
            this.toolBarList[this.toolBarList.length - 1].class = this
              .fullscreen
              ? "iconquanping"
              : "iconhuanyuanhuabu";
            this.handleFullScreen();
            break;
          case "preview":
            this.previewFlag = !this.previewFlag;
            this.toolBarList[this.toolBarList.length - 2].class = this
              .previewFlag
              ? "iconmiwen"
              : "iconzitiyulan";
            break;
          case "editShow":
            this.editShow = !this.editShow;
            break;
          case "theme":
            this.switchTheme();
            break;
          default:
            this.$refs.editPage.resetContent(content);
        }
      }
    },

    handleFullScreen() {
      let element = document.getElementById("c-markdown-container"); //放大的元素，如果整个系统放大，直接赋值 document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11

          element.msRequestFullscreen();
        }
      }

      this.fullscreen = !this.fullscreen;
    },

    exportFiles(type) {
      if (type === "html") {
        exportRaw(
          "corgicoding-markdown.html",
          document.getElementById("c-show-area").innerHTML
        );
      } else {
        exportRaw("corgicoding-markdown.md", this.text);
      }

      function fakeClick(obj) {
        let ev = document.createEvent("MouseEvents");
        ev.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        obj.dispatchEvent(ev);
      }

      function exportRaw(name, data) {
        let urlObject = window.URL || window.webkitURL || window;
        let export_blob = new Blob([data]);
        let save_link = document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          "a"
        );
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        fakeClick(save_link);
      }
    },
  },
};
</script>

<style scoped></style>
