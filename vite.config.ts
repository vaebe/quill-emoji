/// <reference types="vitest" />
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'QuillEmoji',
      fileName: (format) => `quill-emoji.${format}.js`,
    },
    rollupOptions: {
      external: ['quill', 'emoji-mart', '@emoji-mart/data'],
      output: {
        globals: {
          'quill': 'Quill',
          'emoji-mart': 'EmojiMart',
          '@emoji-mart/data': '@emoji-mart/data',
        },
      },
    },
  },
  plugins: [
    dts({ rollupTypes: true }),
  ],
  test: {},
})
