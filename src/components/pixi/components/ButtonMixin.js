import Graphics from './Graphics'

export default class ButtonMixin extends Graphics {
    constructor(p, objectData, fnData = {}) {
        super(p, objectData)
        this.interactive = true
        this.buttonMode = true
        this.fnData = fnData
        this.eventOn = this.eventOn.bind(this)
        this.eventOff = this.eventOff.bind(this)
        this.down = this.down.bind(this)
        this.up = this.up.bind(this)
        this.upOutSide = this.upOutSide.bind(this)
        this.move = this.move.bind(this)
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
            .on('pointermove', this.move)
    }
    eventOff() {
        this
            .off('pointerdown', this.down)
            .off('pointerup', this.up)
            .off('pointerupoutside', this.upOutSide)
            .off('pointerover', this.over)
            .off('pointerout', this.out)
            .off('pointermove', this.move)
    }
    down(e) {
        this.isDown = true
        this.handleEvnet('down', e)
    }
    up(e) {
        if (this.isDown) {
            this.isDown = false
            this.handleEvnet('up', e)
        }
    }
    move(e) {
        this.isMove = true
        this.handleEvnet('move', e)
    }
    upOutSide() {
        this.isDown = false
    }
    over(e) {
        if (this.isDown) {
            this.handleEvnet('down', e)
        }
    }
    out(e) {
        if (this.isDown) {
            this.handleEvnet('out', e)
        }
    }
    handleEvnet(key, e) {
        const obj = this.fnData[key] || {}
        const { fn = () => null, textureID, ...options } = obj
        textureID && this.setTextureKey(textureID)
        Object.assign(this, options)
        fn.call(this, e)
    }
}