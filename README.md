# Quill Emoji Module

这是一个为 Quill 2.0 编辑器开发的表情符号模块，使用 emoji-mart 作为表情选择器。

## 特性

* ✨ 完全支持 Quill 2.0
* 🎨 使用 emoji-mart 作为表情选择器 UI
* 📱 响应式设计，适配移动设备
* 🔄 多种表情选择方式
* 🎭 可自定义主题和样式
* 🔧 使用 TypeScript 开发

## 使用方法

### 基本用法

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quill Emoji Module - 为 Quill 2.0 编辑器开发的表情符号模块</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.min.css">
  <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/emoji-mart@5.6.0/dist/browser.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vaebe/quill-emoji@0.0.7/dist/quill-emoji.min.css">
  <script src="https://cdn.jsdelivr.net/npm/@vaebe/quill-emoji@0.0.7/dist/quill-emoji.umd.min.js"></script>

  <style>
    .editor-container {
      max-width: 800px;
      margin: 0 auto;
    }
  </style>
</head>

<body class="bg-gray-50 min-h-screen">

  <div class="editor-container">
    <div id="editor"></div>
  </div>

  <script type="module">
    let globalQuill;

    Quill.register('modules/emoji', QuillEmoji);

    globalQuill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
        ],
        emoji: {
          theme: 'light',
          locale: 'zh',
          set: 'native',
          previewPosition: 'bottom',
          navPosition: 'top'
        }
      },
      placeholder: '在这里输入文本，点击工具栏的表情符号按钮体验 emoji 组件...'
    });
  </script>
</body>

</html>
```

## npm

```bash
npm install @vaebe/quill-emoji emoji-mart quill
# 或
yarn add @vaebe/quill-emoji emoji-mart quill
# 或
pnpm add @vaebe/quill-emoji emoji-mart quill
```

```javascript
import QuillEmojiModule from '@vaebe/quill-emoji'
import Quill from 'quill'

// 注册模块
Quill.register('modules/emoji', QuillEmojiModule)

const quill = new Quill('#editor', {
  modules: {
    // ...
    emoji: {
      theme: 'light',
      locale: 'zh',
      set: 'native',
      previewPosition: 'bottom',
      navPosition: 'top'
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
