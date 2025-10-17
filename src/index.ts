import type Quill from 'quill'
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'
import './styles.css'

interface QuillToolbar {
  container: HTMLElement
}

interface EmojiModuleOptions {
  theme?: string
  locale?: string
  set?: string
  skinTonePosition?: string
  previewPosition?: string
  searchPosition?: string
  categories?: string[]
  maxFrequentRows?: number
  perLine?: number
  navPosition?: string
  noCountryFlags?: boolean
  dynamicWidth?: boolean
}

export default class QuillEmojiModule {
  static DEFAULTS: EmojiModuleOptions = {
    theme: 'light',
    locale: 'zh',
    set: 'native',
    skinTonePosition: 'none',
    previewPosition: 'bottom',
    searchPosition: 'sticky',
    categories: ['frequent', 'people', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols', 'flags'],
    maxFrequentRows: 2,
    perLine: 8,
    navPosition: 'top',
    noCountryFlags: false,
    dynamicWidth: false,
  }

  private quill: Quill
  private options: EmojiModuleOptions
  private picker: HTMLElement | null
  private isPickerVisible: boolean

  constructor(quill: Quill, options: EmojiModuleOptions = {}) {
    this.quill = quill
    this.options = { ...QuillEmojiModule.DEFAULTS, ...options }
    this.picker = null
    this.isPickerVisible = false

    this.init()
  }

  private init() {
    const toolbar = this.quill.getModule('toolbar') as QuillToolbar
    if (toolbar && toolbar.container) {
      const button = document.createElement('button')
      button.className = 'ql-emoji'
      button.type = 'button'
      button.title = '插入表情符号'

      toolbar.container.appendChild(button)

      button.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (this.isPickerVisible) {
          this.closeDialog()
        } else {
          this.openDialog()
        }
      })
    }
  }

  private getButton() {
    return document.getElementsByClassName('ql-emoji')[0]
  }

  public openDialog() {
    if (!this.picker) {
      this.picker = new Picker({
        data,
        onEmojiSelect: (emoji: any) => this.selectEmoji(emoji),
        onClickOutside: (event: MouseEvent) => this.onClickOutside(event),
        ...this.options,
      }) as unknown as HTMLElement

      document.body.appendChild(this.picker)

      const rect = this.getButton()?.getBoundingClientRect()
      if (rect) {
        this.picker.style.top = `${rect.top + 25}px`
        this.picker.style.left = `${rect.left}px`
      }

      this.picker.style.boxShadow = '0 4px 4px 0 rgba(0, 0, 0, 0.25)'
      this.picker.style.position = 'absolute'
      this.picker.style.zIndex = '1'

      this.isPickerVisible = true
    }
  }

  public closeDialog() {
    this.isPickerVisible = false
    this.picker?.remove()
    this.picker = null
  }

  private selectEmoji(emoji: any) {
    const selection = this.quill.getSelection(true)
    const insertIndex = selection.index

    this.quill.insertText(insertIndex, emoji.native, 'user')

    this.closeDialog()

    setTimeout(() => {
      this.quill.setSelection(insertIndex + emoji.native.length)
    }, 0)
  }

  private onClickOutside(event: MouseEvent): void {
    const but = this.getButton()

    // Only close if the Click did not happen on the Emoji-Button inside the Toolbar when it exists!
    if (!but || !(but === event.target || (event.target instanceof Element && but.contains(event.target)))) {
      this.closeDialog()
    }
  }

  public destroy() {
    this.closeDialog()
  }
}
