import type Quill from 'quill'
import './styles.css'

// 定义 Toolbar 模块的接口
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
    dynamicWidth: true,
  }

  private quill: Quill
  private options: EmojiModuleOptions
  private picker: HTMLElement | null
  private pickerContainer: HTMLDivElement | null
  private isPickerVisible: boolean
  private currentSelection: { index: number, length: number } | null
  private observer: MutationObserver | null
  private clickHandler: ((event: MouseEvent) => void) | null

  constructor(quill: Quill, options: EmojiModuleOptions = {}) {
    this.quill = quill
    this.options = { ...QuillEmojiModule.DEFAULTS, ...options }
    this.picker = null
    this.pickerContainer = null
    this.isPickerVisible = false
    this.currentSelection = null
    this.observer = null
    this.clickHandler = null

    this.init()
  }

  private init(): void {
    this.createEmojiButton()
    this.createEmojiPickerContainer()
    this.bindEvents()
  }

  private createEmojiButton(): void {
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
        this.currentSelection = this.quill.getSelection()
        this.toggleEmojiPicker()
      })
    }
  }

  private createEmojiPickerContainer(): void {
    this.pickerContainer = document.createElement('div')
    this.pickerContainer.className = 'emoji-picker-container'
    document.body.appendChild(this.pickerContainer)
  }

  private async createEmojiPicker(): Promise<void> {
    if (this.picker) {
      return
    }

    try {
      // 创建 emoji-mart 组件
      this.picker = document.createElement('em-emoji-picker')

      // 设置属性
      Object.entries(this.options).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          if (value) {
            this.picker!.setAttribute(key, '')
          }
        } else if (Array.isArray(value)) {
          this.picker!.setAttribute(key, JSON.stringify(value))
        } else if (value !== undefined) {
          this.picker!.setAttribute(key, value.toString())
        }
      })

      this.pickerContainer!.appendChild(this.picker)

      // 等待 Shadow DOM 加载
      let attempts = 0
      const maxAttempts = 50

      while (!this.picker.shadowRoot && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        attempts++
      }

      if (this.picker.shadowRoot) {
        this.setupEmojiEvents()
      } else {
        this.setupFallbackEvents()
      }
    } catch (error) {
      console.error('创建 emoji-mart picker 失败:', error)
    }
  }

  private setupEmojiEvents(): void {
    if (!this.picker) {
      return
    }

    // 方法1: 监听标准事件
    const eventTypes = ['em-emoji-select', 'emoji-select', 'select', 'click']
    eventTypes.forEach((eventType) => {
      this.picker!.addEventListener(eventType, (event) => {
        this.handleEmojiSelect(event as Event)
      })
    })

    // 方法2: 使用 MutationObserver 监听 DOM 变化
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.bindEmojiButtons()
        }
      })
    })

    if (this.picker.shadowRoot) {
      this.observer.observe(this.picker.shadowRoot, {
        childList: true,
        subtree: true,
        attributes: true,
      })
    }

    // 方法3: 定期检查并绑定按钮
    this.bindEmojiButtons()
    setInterval(() => {
      if (this.isPickerVisible) {
        this.bindEmojiButtons()
      }
    }, 1000)
  }

  private setupFallbackEvents(): void {
    if (!this.pickerContainer) {
      return
    }

    // 备用方案：直接在容器上监听点击事件
    this.clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target && target.textContent) {
        const text = target.textContent.trim()
        // 检查是否是表情符号
        if (/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(text)) {
          this.insertEmoji(text)
          this.hideEmojiPicker()
        }
      }
    }

    this.pickerContainer.addEventListener('click', this.clickHandler)
  }

  private bindEmojiButtons(): void {
    if (!this.picker || !this.picker.shadowRoot) {
      return
    }

    // 查找所有可能的表情按钮
    const selectors = [
      'button[data-emoji]',
      'button[title]',
      '.emoji',
      '[role="button"]',
      'button',
    ]

    selectors.forEach((selector) => {
      const buttons = this.picker!.shadowRoot!.querySelectorAll(selector)
      buttons.forEach((button) => {
        if (!button.hasAttribute('data-emoji-bound')) {
          button.setAttribute('data-emoji-bound', 'true')

          button.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()

            const emoji = this.extractEmojiFromButton(button as HTMLElement)
            if (emoji) {
              this.insertEmoji(emoji)
              this.hideEmojiPicker()
            }
          })
        }
      })
    })
  }

  private extractEmojiFromButton(button: HTMLElement): string | null {
    // 尝试多种方式提取表情
    const methods = [
      () => button.textContent?.trim() || null,
      () => button.getAttribute('data-emoji'),
      () => button.getAttribute('title'),
      () => button.dataset?.emoji || null,
      () => {
        const span = button.querySelector('span')
        return span ? span.textContent?.trim() || null : null
      },
    ]

    for (const method of methods) {
      try {
        const result = method()
        if (result) {
          return result
        }
      } catch (e) {
        console.error('获取表情失败！', e)
      }
    }

    return null
  }

  private handleEmojiSelect(event: Event): void {
    let emoji: string | null = null

    // 尝试从事件中提取表情
    const detail = (event as CustomEvent).detail
    if (detail) {
      emoji = detail.native
        || detail.emoji?.native
        || detail.unified
        || (typeof detail === 'string' ? detail : null)
    }

    if (!emoji && event.target) {
      emoji = this.extractEmojiFromButton(event.target as HTMLElement)
    }

    if (emoji) {
      this.insertEmoji(emoji)
      this.hideEmojiPicker()
    }
  }

  private bindEvents(): void {
    // 点击外部区域关闭选择器
    document.addEventListener('click', (e) => {
      if (this.isPickerVisible && this.pickerContainer && !this.pickerContainer.contains(e.target as Node)) {
        const toolbar = this.quill.getModule('toolbar') as QuillToolbar
        if (toolbar && toolbar.container && !toolbar.container.contains(e.target as Node)) {
          this.hideEmojiPicker()
        }
      }
    })

    // 窗口大小变化时调整位置
    window.addEventListener('resize', () => {
      if (this.isPickerVisible) {
        this.positionEmojiPicker()
      }
    })
  }

  private positionEmojiPicker(): void {
    if (!this.pickerContainer) {
      return
    }

    const toolbar = this.quill.getModule('toolbar') as QuillToolbar
    const emojiButton = toolbar?.container?.querySelector('.ql-emoji') as HTMLElement

    if (emojiButton) {
      const rect = emojiButton.getBoundingClientRect()
      const pickerWidth = 352
      const pickerHeight = 435

      let left = rect.left
      let top = rect.bottom + 5

      if (left + pickerWidth > window.innerWidth) {
        left = window.innerWidth - pickerWidth - 10
      }

      if (top + pickerHeight > window.innerHeight) {
        top = rect.top - pickerHeight - 5
      }

      if (top < 0) {
        top = 10
      }

      if (window.innerWidth <= 768) {
        this.pickerContainer.style.position = 'fixed'
        this.pickerContainer.style.top = '50%'
        this.pickerContainer.style.left = '50%'
        this.pickerContainer.style.transform = 'translate(-50%, -50%)'
      } else {
        this.pickerContainer.style.position = 'absolute'
        this.pickerContainer.style.left = `${left}px`
        this.pickerContainer.style.top = `${top}px`
        this.pickerContainer.style.transform = 'none'
      }
    }
  }

  private async toggleEmojiPicker(): Promise<void> {
    if (this.isPickerVisible) {
      this.hideEmojiPicker()
    } else {
      await this.showEmojiPicker()
    }
  }

  private async showEmojiPicker(): Promise<void> {
    if (!this.picker) {
      await this.createEmojiPicker()
    }

    if (!this.pickerContainer) {
      return
    }

    this.positionEmojiPicker()
    this.pickerContainer.style.display = 'block'
    this.isPickerVisible = true

    requestAnimationFrame(() => {
      if (this.pickerContainer) {
        this.pickerContainer.classList.add('show')
      }
    })

    // 延迟绑定事件，确保组件完全渲染
    setTimeout(() => {
      this.bindEmojiButtons()
    }, 500)
  }

  private hideEmojiPicker(): void {
    if (!this.pickerContainer) {
      return
    }

    this.pickerContainer.classList.remove('show')
    setTimeout(() => {
      if (this.pickerContainer) {
        this.pickerContainer.style.display = 'none'
      }
    }, 200)
    this.isPickerVisible = false
  }

  /**
   * 插入表情到编辑器
   * @param emoji 表情字符
   */
  public insertEmoji(emoji: string): void {
    try {
      let range = this.currentSelection || this.quill.getSelection(true)

      if (!range) {
        const length = this.quill.getLength()
        range = { index: Math.max(0, length - 1), length: 0 }
      }

      this.quill.insertText(range.index, emoji, 'user')
      this.quill.setSelection(range.index + emoji.length, 0)
    } catch (error) {
      console.error('插入表情失败:', error)
    }
  }

  /**
   * 手动显示表情选择器
   */
  public async showEmojiPickerManually(): Promise<void> {
    this.currentSelection = this.quill.getSelection()
    await this.showEmojiPicker()
  }

  /**
   * 销毁模块，清理事件监听器和DOM元素
   */
  public destroy() {
    // 清理事件监听器
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    if (this.clickHandler && this.pickerContainer) {
      this.pickerContainer.removeEventListener('click', this.clickHandler)
      this.clickHandler = null
    }

    // 移除DOM元素
    if (this.pickerContainer) {
      if (this.picker) {
        this.pickerContainer.removeChild(this.picker)
        this.picker = null
      }
      document.body.removeChild(this.pickerContainer)
      this.pickerContainer = null
    }

    this.isPickerVisible = false
    this.currentSelection = null
  }
}
