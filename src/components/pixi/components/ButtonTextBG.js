import Text from './Text'

export default class ButtonTextBG extends Text {
    constructor(objectData, bgData, fnData = {}) {
        super(objectData)
        this.bgData = bgData
        this.bg = new PIXI.Graphics()
        this.parent.addChild(this.bg, this)
        this.updateBG()
        this.bg.interactive = true
        this.bg.buttonMode = true
        this.fnData = fnData
        this.eventOn = this.eventOn.bind(this)
        this.eventOff = this.eventOff.bind(this)
        this.down = this.down.bind(this)
        this.up = this.up.bind(this)
        this.upOutSide = this.upOutSide.bind(this)
        this.over = this.over.bind(this)
        this.out = this.out.bind(this)
        this.handleEvnet = this.handleEvnet.bind(this)
        this.eventOn()
    }
    eventOn() {
        this.bg
            .on('pointerdown', this.down)
            .on('pointerup', this.up)
            .on('pointerupoutside', this.upOutSide)
            .on('pointerover', this.over)
            .on('pointerout', this.out)
    }
    eventOff() {
        this.bg
            .off('pointerdown', this.down)
            .off('pointerup', this.up)
            .off('pointerupoutside', this.upOutSide)
            .off('pointerover', this.over)
            .off('pointerout', this.out)
    }
    down() {
        this.isDown = true
        this.handleEvnet('down')
    }
    up() {
        if (this.isDown) {
            this.isDown = false
            this.handleEvnet('up')
        }
    }
    upOutSide() {
        this.isDown = false
    }
    over() {
        if (this.isDown) {
            this.handleEvnet('down')
        }
    }
    out() {
        if (this.isDown) {
            this.handleEvnet('out')
        }
    }
    handleEvnet(key) {
        const obj = this.fnData[key] || {}
        const { fn = () => null, text = {}, bg = {} } = obj
        Object.assign(this, text)
        Object.assign(this.bg, bg)
        const { bgColor = this.bgData.bgColor } = bg
        this.draw(bgColor)
        fn.call(this)
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
        this.draw(bgColor, width, height, radius)
        Object.assign(this.bg, { x, y }, bgOptions)
    }
    draw(bgColor, width, height, radius) {
        bgColor = bgColor || this.bgData.bgColor
        width = width || this.bg.width
        height = height || this.bg.height
        radius = radius || this.bgData.radius
        this.bg.clear()
        this.bg
            .beginFill(bgColor)
            .drawRoundedRect(0, 0, width, height, radius)
            .endFill()
    }
}