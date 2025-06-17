/// <reference types="vitest" />
import { resolve } from 'node:path'
import camelCase from 'camelcase'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import packageJson from './package.json'

const packageName = packageJson.name.split('/').pop() || packageJson.name

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: camelCase(packageName, { pascalCase: true }),
      fileName: packageName,
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
