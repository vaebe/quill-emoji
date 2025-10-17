var c = Object.defineProperty;
var r = (o, t, i) => t in o ? c(o, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : o[t] = i;
var s = (o, t, i) => r(o, typeof t != "symbol" ? t + "" : t, i);
import a from "@emoji-mart/data";
import { Picker as h } from "emoji-mart";
const n = class n {
  constructor(t, i = {}) {
    s(this, "quill");
    s(this, "options");
    s(this, "picker");
    s(this, "isPickerVisible");
    this.quill = t, this.options = { ...n.DEFAULTS, ...i }, this.picker = null, this.isPickerVisible = !1, this.init();
  }
  init() {
    const t = this.quill.getModule("toolbar");
    if (t && t.container) {
      const i = document.createElement("button");
      i.className = "ql-emoji", i.type = "button", i.title = "插入表情符号", t.container.appendChild(i), i.addEventListener("click", (e) => {
        e.preventDefault(), e.stopPropagation(), this.isPickerVisible ? this.closeDialog() : this.openDialog();
      });
    }
  }
  getButton() {
    return document.getElementsByClassName("ql-emoji")[0];
  }
  openDialog() {
    var t;
    if (!this.picker) {
      this.picker = new h({
        data: a,
        onEmojiSelect: (e) => this.selectEmoji(e),
        onClickOutside: (e) => this.onClickOutside(e),
        ...this.options
      }), document.body.appendChild(this.picker);
      const i = (t = this.getButton()) == null ? void 0 : t.getBoundingClientRect();
      i && (this.picker.style.top = `${i.top + 25}px`, this.picker.style.left = `${i.left}px`), this.picker.style.boxShadow = "0 4px 4px 0 rgba(0, 0, 0, 0.25)", this.picker.style.position = "absolute", this.picker.style.zIndex = "1", this.isPickerVisible = !0;
    }
  }
  closeDialog() {
    var t;
    this.isPickerVisible = !1, (t = this.picker) == null || t.remove(), this.picker = null;
  }
  selectEmoji(t) {
    const e = this.quill.getSelection(!0).index;
    this.quill.insertText(e, t.native, "user"), this.closeDialog(), setTimeout(() => {
      this.quill.setSelection(e + t.native.length);
    }, 0);
  }
  onClickOutside(t) {
    const i = this.getButton();
    (!i || !(i === t.target || t.target instanceof Element && i.contains(t.target))) && this.closeDialog();
  }
  destroy() {
    this.closeDialog();
  }
};
s(n, "DEFAULTS", {
  theme: "light",
  locale: "zh",
  set: "native",
  skinTonePosition: "none",
  previewPosition: "bottom",
  searchPosition: "sticky",
  categories: ["frequent", "people", "nature", "foods", "activity", "places", "objects", "symbols", "flags"],
  maxFrequentRows: 2,
  perLine: 8,
  navPosition: "top",
  noCountryFlags: !1,
  dynamicWidth: !1
});
let l = n;
export {
  l as default
};
