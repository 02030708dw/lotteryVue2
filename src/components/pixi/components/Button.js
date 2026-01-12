import Sprite from './Sprite'

export default class Button extends Sprite {
    constructor(objectData, fnData = {}) {
        super(objectData)
        this.interactive = true
        this.buttonMode = true
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
        this
            .on('pointerdown', this.down)
            .on('pointerup', this.up)
            .on('pointerupoutside', this.upOutSide)
            .on('pointerover', this.over)
            .on('pointerout', this.out)
    }
    eventOff() {
        this
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
        const { fn = () => null, textureID, ...options } = obj
        textureID && this.setTextureKey(textureID)
        Object.assign(this, options)
        fn.call(this)
    }
}