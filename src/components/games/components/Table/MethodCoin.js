import Sprite from '@C/pixi/components/Sprite'

export default class Method extends Sprite {
    constructor(objectData) {
        super(objectData)
        this.anchor.set(0.5)
        this.zIndex = 2
    }
    putAnimation(pointer, notAnimation) {
        const rotation = Math.PI / 180 * Math.randomNum(360)
        const timeArr = [0.3, 0.4, 0.5, 0.6, 0.7]
        const time = Math.randomNum(timeArr.length)
        const { x, y } = pointer
        this.tempTime = timeArr[time]
        notAnimation
            ? Object.assign(this, pointer)
            : TweenMax.to(this, this.tempTime, { x, y, rotation })
    }
    clear () {
        const { x, y } = this.objectData
        const randomNum = Math.randomNum(100)
        this.zIndex = 1
        TweenMax
            .to(this, this.tempTime, { x: x + randomNum, y })
            .eventCallback('onComplete', () => this.destroy())
    }
}
