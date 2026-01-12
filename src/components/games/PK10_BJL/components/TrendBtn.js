import Text from '@C/pixi/components/Text'
import Sprite from '@C/pixi/components/Sprite'
import Graphics from '@C/pixi/components/Graphics'

const g = ['tlbtng', 'tcbtng', 'trbtng']
const b = ['tlbtnb', 'tcbtnb', 'trbtnb']
export default class TrendBtn extends Graphics {
    constructor(objectData, fnData = {}) {
        const { text, style, p, ...options } = objectData
        super(p, options)
        this.objectData = objectData
        this.font = new Text({ zIndex: 1, text, style, p: this })
        this.updateBG()
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
        const { fn = () => null, text = {} } = obj
        Object.assign(this.font, text)
        fn.call(this)
    }
    /**
     *
     * 更新文字及背景寬度
     * @param {String} text 字串
     * @memberof TextBg
     */
    updateBG(text) {
        this.font.text = text || this.objectData.text
        const { paddingW = 15 } = this.objectData
        const width = this.width + paddingW
        this.draw(width)
    }
    setActive() {
        b.forEach((key, i) => this.btnSP[i].setTextureKey(key))
    }
    cancelActive() {
        b.forEach((key, i) => this.btnSP[i].setLastTexture(key))
    }
    draw(width) {
        this.btnSP = g.map((key) => {
            return new Sprite({
                id: 'trend',
                key,
                p: this
            })
        })
        const lWidth = this.btnSP[0].width
        const rWidth = this.btnSP[2].width
        const cWidth = Math.max(width - (lWidth + rWidth), 0)
        const sum = lWidth + rWidth + cWidth
        this.btnSP[1].width = cWidth
        this.btnSP[1].x = lWidth - 2
        this.btnSP[2].x = this.btnSP[1].x + cWidth - 2
        this.font.x = sum / 2
        this.font.y = 20
    }
}