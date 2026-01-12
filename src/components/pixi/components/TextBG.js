// import * as PIXI from 'pixi.js'
import drag from '@C/pixi/drag'
import Text from './Text'

/**
 * 文字加上背景伸縮用
 * @export
 * @class TextBg
 * @extends {Text}
 */
export default class TextBg extends Text {
    hideTween = null
    showTween = null
    constructor(objectData, bgData) {
        super(objectData)
        this.bgData = bgData
        this.parent.bg = new PIXI.Graphics()
        this.parent.addChild(this.parent.bg, this)
        this.updateBG()
    }

    /**
     *
     * 更新文字及背景寬度
     * @param {String} text 字串
     * @memberof TextBg
     */
    updateBG(text) {
        this.bgData.text = text || this.bgData.text
        this.text = this.bgData.text
        const { paddingW = 15, paddingH = 10, bgColor = 0x000000, radius = 3, ...bgOptions } = this.bgData
        const width = this.width + paddingW
        const height = this.height + paddingH
        const x = this.x - (width / 2)
        const y = this.y - (height / 2)
        this.parent.bg.clear()
        this.parent.bg
            .beginFill(bgColor)
            .drawRoundedRect(0, 0, width, height, radius)
            .endFill()
        Object.assign(this.parent.bg, { x, y }, bgOptions)
    }

    /**
     * 透明度顯示
     * @param {String} text 字串
     * @memberof TextBg
     */
    show(text) {
        this.updateBG(text)
        this.hideTween && this.hideTween.kill()
        this.showTween = TweenMax.to(this.parent, 0.3, { alpha: 1 })
    }

    /**
     *
     * 透明度隱藏
     * @memberof TextBg
     */
    hide(fn) {
        this.hideTween = TweenMax
            .to(this.parent, 0.3, { alpha: 0 })
            .eventCallback('onComplete', fn)
    }
}