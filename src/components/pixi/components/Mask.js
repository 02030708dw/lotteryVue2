import Sprite from '@C/pixi/components/Sprite'

export default class Mask extends Sprite {
    constructor(options) {
        super(options)
        this.interactive = true
        this.tween = null
        this.count = 0
        this.queue = []
        this.isDown = false
    }
    eventOn() {
        this
            .on('pointerdown', this.down)
            .on('pointerup', this.up)
    }
    eventOff() {
        this
            .off('pointerdown', this.down)
            .off('pointerup', this.up)
    }
    show(c, fn) {
        if (!this.count++) {
            this.eventOn()
            this.visible = true
            this.tween && this.tween.kill()
            this.tween = TweenMax
                .to(this, 0.3, { alpha: 0.8 })
            if (c) {
                c.parent && this.front.addChild(c)
                fn && this.queue.push({
                    c,
                    fn
                })
            }
        }
    }
    hide(c = {}, fn = () => {}) {
        this.queue = this.queue.filter(obj => {
            const bool = obj.c.name !== c.name
            !bool && obj.fn()
            return bool
        })
        if (!--this.count) {
            // this.count === 0
            this.eventOff()
            this.tween && this.tween.kill()
            this.tween = TweenMax
                .to(this, 0.3, { alpha: 0 })
                .eventCallback('onComplete', () => {
                    this.visible = false
                    c.parent && this.container.addChild(c)
                })
        } else {
            // this.count !== 0
            c.parent && this.container.addChild(c)
        }
        fn()
    }
    down() {
        this.isDown = true
    }
    up() {
        if (this.isDown && this.queue.length) {
            const {c, fn} = this.queue.shift()
            this.hide(c, fn)
        }
        this.isDown = false
    }
}