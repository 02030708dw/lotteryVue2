// import * as PIXI from 'pixi.js'
import drag from '@C/pixi/drag'
import Sprite3d from '@C/pixi/components/Sprite3D'
export default class Card extends Sprite3d {
    constructor(objectData) {
        super(objectData)
        this.ori = {
            x: objectData.x,
            y: objectData.y
        }
        this.coldTime = this.coldTime || 0.4
        // drag(this)
    }
    cardAnimation(isAnimation = true) {
        if (isAnimation) {
            // card, i, coldTime
            const tween = TweenMax.to(this, this.coldTime, this.pos)
            return new Promise((resolve) => tween.eventCallback('onComplete', () => resolve(tween)))
        } else {
            this.x = this.pos.x
            this.y = this.pos.y
        }
    }
    turnCardAnimation(key) {
        TweenMax.to(this, 0.1, {pixi: {scaleX: 0},
            onComplete: () => {
                this.setTextureKey(key)
                TweenMax.to(this, 0.3, {pixi: {scaleX: 1}})
            }})
    }
    destroyAnimation() {
        // card, i, coldTime
        const tween = TweenMax.to(this, this.coldTime, this.ori)
        tween.eventCallback('onComplete', () => this.destroyCombo())
    }
    destroyCombo() {
        TweenMax.killTweensOf(this)
        this.destroy()
    }
}