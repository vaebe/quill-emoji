import { default as default_2 } from 'quill';

declare interface EmojiModuleOptions {
    theme?: string;
    locale?: string;
    set?: string;
    skinTonePosition?: string;
    previewPosition?: string;
    searchPosition?: string;
    categories?: string[];
    maxFrequentRows?: number;
    perLine?: number;
    navPosition?: string;
    noCountryFlags?: boolean;
    dynamicWidth?: boolean;
}

declare class QuillEmojiModule {
    static DEFAULTS: EmojiModuleOptions;
    private quill;
    private options;
    private picker;
    private isPickerVisible;
    constructor(quill: default_2, options?: EmojiModuleOptions);
    private init;
    private getButton;
    openDialog(): void;
    private selectEmoji;
    private onClickOutside;
    closeDialog(): void;
    destroy(): void;
}
export default QuillEmojiModule;

export { }
