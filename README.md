# Quill Emoji Module

这是一个为 Quill 2.0 编辑器开发的表情符号模块，使用 emoji-mart 作为表情选择器。

## 特性

* ✨ 完全支持 Quill 2.0
* 🎨 使用 emoji-mart 作为表情选择器 UI
* 📱 响应式设计，适配移动设备
* 🔄 多种表情选择方式
* 🎭 可自定义主题和样式
* 🔧 使用 TypeScript 开发

## 安装

```bash
npm install @quill-modules/emoji emoji-mart
# 或
yarn add @quill-modules/emoji emoji-mart
# 或
pnpm add @quill-modules/emoji emoji-mart
```

## 使用方法

### 基本用法

```html
<link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/emoji-mart@5.6.0/dist/browser.min.js"></script>
<script src="path/to/quill-emoji.js"></script>

<div id="editor"></div>

<script>
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline'],
          ['emoji']
        ]
      },
      emoji: {
        // 配置选项
        theme: 'light',
        locale: 'zh',
        set: 'native'
      }
    }
  });
</script>
```

### 使用 ES 模块

```javascript
import QuillEmojiModule from '@quill-modules/emoji'
import Quill from 'quill'

// 注册模块
Quill.register('modules/emoji', QuillEmojiModule)

const quill = new Quill('#editor', {
  // 配置...
  modules: {
    // ...
    emoji: {
      // 配置选项
    }
  }
})
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| theme | string | 'light' | emoji-mart 主题，可选 'light' 或 'dark' |
| locale | string | 'zh' | 语言设置 |
| set | string | 'native' | 表情集，可选 'native', 'apple', 'google', 'twitter', 'facebook' |
| skinTonePosition | string | 'none' | 肤色选择器位置 |
| previewPosition | string | 'bottom' | 预览位置 |
| searchPosition | string | 'sticky' | 搜索框位置 |
| categories | string[] | ['frequent', ...] | 要显示的分类 |
| maxFrequentRows | number | 2 | 常用表情的最大行数 |
| perLine | number | 8 | 每行显示的表情数量 |
| navPosition | string | 'top' | 导航栏位置 |
| noCountryFlags | boolean | false | 是否隐藏国旗表情 |
| dynamicWidth | boolean | true | 是否使用动态宽度 |

## API

### 方法

```javascript
// 获取模块实例
const emojiModule = quill.getModule('emoji')

// 插入表情
emojiModule.insertEmoji('😀')

// 手动显示表情选择器
emojiModule.showEmojiPickerManually()

// 销毁模块（清理事件和DOM元素）
emojiModule.destroy()
```

## 示例

查看 `examples` 目录中的示例文件。

## 构建项目

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 运行测试
pnpm test
```

## License

This template was created under the [MIT License](LICENSE).
