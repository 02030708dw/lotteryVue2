import Method from '@C/games/components/Table/Method'
import Graphics from '@C/pixi/components/Graphics'
// E:\project\gameclient\vue\src\components\games\components\Table\Method.js
// import drag from '@C/pixi/drag'

/**
 * 9401 賠率不同時更新處理
 * 9501 停售
 * 9502 封鎖超過投注限額
 * 9503 停售 & 封鎖超過投注限額
 * 9504 投注项投注用戶限額
 */
export default class MethodBJL extends Method {
    constructor(...data) {
        super(...data)
    }
    // async drawEraserTexture() {
    //     this.blankAnimation(250, 5)
    // }
    async blankAnimation(coldTime, repeat) {
        this.graphicsAnimation = new Graphics(this, {alpha: 0})
        this.draw(this.graphicsAnimation, {lineStyle: 0xffffff, weight: 10})
        TweenMax.to(this.graphicsAnimation, coldTime, {
            pixi: {blurX: 10, blurY: 10},
            alpha: 0.43,
            repeat,
            yoyo: true,
            onComplete: () => this.graphicsAnimation.destroy()
            // pixi: {lineColor: 0x00ff14, blurX: 2, blurY: 2}, repeat, yoyo: true
        })
    }
}
