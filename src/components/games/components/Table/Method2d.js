import MethodCoin from './MethodCoin'
import Container from '@C/pixi/components/Container'
import Container2d from '@C/pixi/components/Container2d'
import Graphics from '@C/pixi/components/Graphics'
import AnimatedSprite from '@C/pixi/components/AnimatedSprite'
import Sprite from '@C/pixi/components/Sprite'
import Text from '@C/pixi/components/Text'
import Text2d from '@C/pixi/components/Text2d'
import drag from '@C/pixi/drag'

/**
 * 9401 賠率不同時更新處理
 * 9501 停售
 * 9502 封鎖超過投注限額
 * 9503 停售 & 封鎖超過投注限額
 * 9504 投注项投注用戶限額
 */
export default class Method2d extends Container2d {
    coins = []
    codeMethod = {
        '0': this.drawTexture,
        '1': this.drawEraserTexture,
        '9401': this.handleAutoOdds,
        '9501': this.drawBlocked,
        '9502': this.drawOverLimit,
        '9503': this.drawBlocked,
        // 多幣投注金額小於最小值
        '8003': this.drawOverLimit
        // '9504': ,
    }
    color = {
        autoOdds: '#ff7bac'
    }
    constructor(objectData, textData, titleData, playFn, prizeFn) {
        const { p, method, maxCoin = 30, ...options } = objectData
        super(p, {maxCoin, ...options})
        this.method = method
        this.sortableChildren = true
        this.interactive = true
        this.buttonMode = true
        this.objectData = objectData
        this.textData = textData
        this.titleData = titleData
        this.playFn = playFn
        this.prizeFn = prizeFn
        // 框線及背景
        this.graphics = new Graphics(this)
        this.updateStaus()
        this.initTitle()
        this.initPrize()
        this
            .on('pointerup', this.up)
            .on('pointerdown', this.down)

        // this.proj.setAxisY({x: 0, y: 1000}, 1)
        // this.proj.setAxisY(posY, 2);
        // drag(this)
        // 查看觸碰區域
        // this.drawHitArea()
    }
    drawHitArea () {
        const g = new Graphics(this, { alpha: 0.6 })
        g.beginFill(0xff0000) // black color
        g.drawPolygon(this.objectData.hitArea.points)
        g.endFill()
    }
    // 圖片標題
    initTitle() {
        const titleData = this.titleData
        if (Array.isArray(titleData)) {
            this.methodTitle = titleData.map(({isAnimation, ...data}) => isAnimation
                ? new AnimatedSprite({ ...data, zIndex: 1, p: this, anchor: {x: 0.5, y: 0.5} }).play()
                : new Sprite({ ...data, zIndex: 1, p: this, anchor: {x: 0.5, y: 0.5} }))
        } else {
            const {isAnimation, ...data} = titleData
            this.methodTitle = isAnimation
                ? new AnimatedSprite({ ...data, zIndex: 1, p: this, anchor: {x: 0.5, y: 0.5} }).play()
                : new Sprite({ ...data, zIndex: 1, p: this, anchor: {x: 0.5, y: 0.5} })
        }
    }
    // 文字賠率
    initPrize() {
        const textData = this.textData
        const text = this.getPrize(true)
        this.prize = []
        if (Array.isArray(textData)) {
            textData.forEach(data => {
                // 非'賠率文字'的時候不塞入賠率
                if (data.isNotPrize) {
                    const text = new Text2d({ ...data, zIndex: 1, p: this })
                    drag(text)
                    return
                }
                const prize = new Text2d({ ...data, zIndex: 1, p: this, text })
                drag(prize)
                prize.color = data.style.fill
                this.prize.push(prize)
            })
        } else {
            const prize = new Text2d({ text, zIndex: 1, ...textData, p: this })
            prize.color = textData.style.fill
            this.prize.push(prize)
        }
    }
    add(options) {
        const coin = new MethodCoin(options)
        this.coins.push(coin)
        this.filter()
        coin.putAnimation(this.getRandomPos())
    }
    filter () {
        if (this.coins.length > this.maxCoin) {
            const shift = this.coins.shift()
            TweenMax.killTweensOf(shift)
            shift.destroy()
        }
    }
    up () {
        if (this.isDown) {
            this.playFn(this.method)
            this.isDown = false
        }
    }
    down () {
        this.isDown = true
    }
    double() {
        let coinArr = []
        this.coins.forEach(({objectData, scale}) => {
            const { id, key, p, x, y } = objectData
            const clone = new MethodCoin({
                id,
                key,
                p,
                x,
                y,
                scale
            })
            clone.putAnimation(this.getRandomPos(), true)
            coinArr.push(clone)
            this.filter()
        })
        this.coins.push(...coinArr)
    }
    /**
     * 取得賠率的數值
     * @param {boolean} isDisplay 是否為顯示用賠率(扣除本金1)
     */
    getPrize(isDisplay = false) {
        const pz = this.prizeFn(this.method)
        //停售
        if (isNaN(pz)) return pz
        return (isDisplay ? pz - 1 : pz).strip()
    }
    getRandomPos() {
        const { width: coinW, height: coinH } = this.coins[0].getBounds()
        const coinHH = coinH / 2
        const coinHW = coinW / 2

        // 玩法的絕對位置及寬高
        let { x: px, y: py, width, height } = this.getBounds()
        // if (PIXI.isTest) {
        //     let temp = width
        //     width = height
        //     hei
        // }
        const padding = this.padding || {}
        const { all = 0 } = padding
        const { top = all, right = all, bottom = all, left = all } = padding
        const xArea = width - coinHW - (right ? width * right : right)
        const yArea = height - coinHH - (bottom ? height * bottom : bottom)
        const xMin = px + coinHW + (left ? width * left : left)
        const yMin = py + coinHH + (top ? height * top : top)
        const hitTest = () => {
            const x = Math.max(Math.randomNum(~~xArea) + px, xMin)
            const y = Math.max(Math.randomNum(~~yArea) + py, yMin)
            const pos = this.toLocal(new PIXI.Point(x, y))
            if (this.hitArea.contains(pos.x, pos.y)) {
                // console.log(this.toLocal.toString())
                const posP = this.parent.toLocal(new PIXI.Point(x, y))
                return { x: posP.x, y: posP.y }
            }
            return hitTest()
        }
        return hitTest()
    }
    /**
     * 撤掉區塊內的籌碼
     * @memberof Method
     */
    clearCoins () {
        this.coins.forEach(coin => coin.clear())
        this.coins = []
        // this.drawTexture()
    }

    /**
     * 停售處理
     * @memberof Method
     */
    drawBlocked () {
        this.clearCoins()
        this.graphics.clear()
        this.graphics.beginFill(0x000000)
        this.draw(this.graphics, {isFill: false})
        this.graphics.zIndex = 2
        this.graphics.alpha = 0.7
        this.zIndex = 0
    }
    /**
     * 封鎖
     */
    drawOverLimit () {
        this.graphics.clear()
        this.draw(this.graphics, {lineStyle: 0xff7bac})
        this.zIndex = 2
    }
    drawEraserTexture() {
        this.graphics.clear()
        this.draw(this.graphics, {lineStyle: 0xf0f000})
        this.zIndex = 2
    }
    drawTexture () {
        this.graphics.clear()
        this.graphics.beginFill(0, 0)
        this.graphics.zIndex = 0
        this.graphics.alpha = 1
        this.draw(this.graphics, {lineStyle: 0xffffff})
        this.zIndex = 1
    }
    handleAutoOdds () {
        const p = this.prize[0]
        const prize = this.getPrize(true)
        if (prize !== +p.text) {
            p.style.fill = this.color.autoOdds
            p.text = prize
        }
    }
    setStatus (code) {
        this.statusCode = code
    }
    setStatusAndUpdate (code) {
        // if (this.statusCode !== code) {
        this.setStatus(code)
        this.updateStaus()
        // }
    }
    /**
     * 設定顯示賠率
     * @param {string|number} prize 停售/賠率數字
     * @param {boolean} isDisplay 是否為"顯示用賠率" (扣除本金1)
     */
    setPrize (prize, isDisplay = false) {
        //停售
        this.prize[0].text = isNaN(prize)
            ? prize
            : (isDisplay ? prize - 1 : prize).strip()
    }
    setPrizeColor (fill) {
        this.prize[0].style.fill = fill
    }
    updateStaus () {
        this.codeMethod[this.statusCode || 0].call(this)
    }
}
