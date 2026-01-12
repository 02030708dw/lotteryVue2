<script>
import drag from '@C/pixi/drag'
import AnimatedSprite from '@C/pixi/components/AnimatedSprite'
import Sprite from '@C/pixi/components/Sprite'
import Text from '@C/pixi/components/Text'
import TextBG from '@C/pixi/components/TextBG'
import Button from '@C/pixi/components/Button'
import Container from '@C/pixi/components/Container'
import ButtonMixin from '@C/pixi/components/ButtonMixin'
import CurvedText from '@C/pixi/components/CurvedText'

// import * as PIXI from 'pixi.js'

export default {
    name: 'draw',
    beforeMount() {
        // this.drawBubbleTimer = setInterval(this.drawBubble, 3000)
        // document.onvisibilitychange = () => { //偵測視窗是否作用中來迴避瀏覽器切換時加速的問題
        //     if (document.visibilityState === 'visible') {
        //         this.drawBubbleTimer = setInterval(this.drawBubble, 3000)
        //     } else {
        //         clearInterval(this.drawBubbleTimer)
        //     }
        // }
        this.drawFnFlow.push(
            this.drawBg,
            this.drawTip,
            this.drawLottery,
            this.drawMoneyPlace,
            this.drawMutiPlace,
            this.drawColdDown,
            this.drawMoneyArea
        )
        this.resourceArr.push(
            { id: 'bg', file: 'bg.jpg' },
            { id: 'table', file: 'table.png' },
            // { id: 'lotteryBg', file: 'lotteryBg/sp.json' },
            { id: 'place', file: 'place/sp.json' },
            { id: 'lotteryIcon', file: 'lotteryIcon.png' },
            { id: 'logo', file: 'logo/sp.json' },
            { id: 'bubbleImg', file: 'snow.png' },
            // 背景音樂
            { id: 'K3_SB_bg', file: 'K3_SB_v2.mp3', isSound: true }
        )
        // 彩種圖一次加載
        // this.lotteryListTable[this.gameType].childs.forEach((lottery) => {
        //     this.resourceArr.push({
        //         id: `lottery${lottery.lottery}`,
        //         file: `c_lottery--${lottery.lottery}.svg`,
        //         urlPath: `${CDN}/static/image/lang_${this.lang}/c_lottery-category/c_lottery-class--${this.gameType}/`
        //     })
        // })
    },
    beforeDestroy() {
        // clearInterval(this.drawBubbleTimer)
        // this.bubbleTimer.forEach(time => clearTimeout(time))
    },
    data() {
        return {
            bubbleTimer: []
        }
    },
    methods: {
        drawBg() {
            const p = new Container(this.container, {name: 'Bg'})
            // 桌子
            this.root.bg = new Sprite({id: 'bg', p: this.root})
            const table = new Sprite({ id: 'table', x: 80, y: 35, p })
            this.root.bubble = new Container(this.container, {name: 'bubble', y: -150, zIndex: 3})
            // 背景音樂
            this.setSoundOptionAndPlay('K3_SB_bg', {
                volume: 0.5,
                loop: true
            })

            // 底層對焦用
            // const bg2 = new Sprite({id: 'bg2', p, alpha: 0.3})
        },
        drawTip() {
            const p = this.tip = new Container(this.container, {name: 'Tip', zIndex: 98, alpha: 0})
            const style = {
                fill: '#ffffff',
                fontSize: 18
                // stroke: '#ffffff',
                // strokeThickness: 1
            }
            const text = new TextBG(
                {x: 640, y: 581, p, style},
                {paddingW: 50, alpha: 0.75, radius: 15}
            )
        },
        drawLottery() {
            const p = new Container(this.container, {name: 'Lottery'})
            const lotteryBtn = new Button({ id: 'lotteryIcon', x: 0, y: 0, p }, {
                up: {
                    fn: () => {
                        this.$router.push('/')
                    }
                }
            })
            var style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 20,
                fill: '#232037',
                fontWeight: 'bold',
                stroke: '#00ffff',
                strokeThickness: 0.5
            }
            const logoGif = new AnimatedSprite({
                p: lotteryBtn,
                id: 'logo',
                x: 0,
                y: -5
            })
            logoGif.play()
            //console.log(this.$t(this.getLotterySName(this.lotteryNameKey)),this.getLotterySName(this.lotteryNameKey))
            var lotteryName = new CurvedText({ p: lotteryBtn, text: this.$t(this.getLotterySName(this.lotteryNameKey)), x: 89, y: 248, style})
            p.zIndex = 2
        },
        drawMoneyPlace() {
            const p = new ButtonMixin(this.container, {name: 'Money'}, {
                down: {
                    fn: () => {
                        moneyUpdateBtn.alpha = 0.5
                    }
                },
                up: {
                    fn: () => {
                        this.setSoundOptionAndPlay('closebell', {volume: 0.5})
                        moneyUpdateBtn.alpha = 1

                        const sfn = () => {
                            const btn = moneyUpdateBtn
                            btn.tween && btn.tween.kill()
                            btn.tween = TweenMax.to(btn, 0.15, { rotation: -Math.PI * 2, repeat: -1 })
                        }
                        const efn = () => {
                            const btn = moneyUpdateBtn
                            btn.tween.kill()
                            btn.tween = TweenMax.to(btn, 0.15, { rotation: -Math.PI * 2, repeat: 2 })
                            btn.rotation = 0
                        }
                        this.fetchBlance(sfn, efn)
                    }
                },
                out: {
                    fn: () => {
                        moneyUpdateBtn.alpha = 1
                    }
                }
            })

            const moneyPlace = new Sprite({ id: 'place', key: 'moneyPlace', x: 832.6, y: 4.2, p })
            const moneyUpdateBtn = new Button({ id: 'place', key: 'icon', x: 1074, y: 32, anchor: {x: 0.5, y: 0.5}, p })
            const style = { fontSize: 18, fill: '#fff' }
            this.balance = new Text({ text: this.getBalance, style, x: 975, y: 33, p })
        },
        drawMutiPlace() {
            if (this.isShowOrderFutureButton && this.muti === undefined) {
                const p = new Container(this.container, {name: 'Muti'})
                this.muti = p
                const fill = ['#ffffff', '#6ce1ff']

                const style = { fontFamily: 'Microsoft Yahei', fontSize: 22, fill, fontWeight: 'bold', stroke: '#2d69a5', strokeThickness: 4, letterSpacing: 1 }
                this.moneyPlace = new Button({ id: 'place', key: 'mutiPlace', x: 743, y: 662.8, p }, {
                    up: {
                        fn: () => {
                            const value = this.orderFuture ? this.orderFutureNum : 0
                            const fn = num => this.moneyPlace.setNum(num)
                            this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                            this.drawCalculator(value, fn)
                        }
                    }
                })
                this.moneyPlace.setNum = (num) => {
                    let num2
                    if ([0, 1].includes(+num)) {
                        num2 = 0
                    }
                    num2 = Math.min(+num, this.MAX_ORDER_FUTURE_NUM, this.gamenumbersLength)
                    this.orderFutureNum = num2
                    if ([0, 1].includes(this.orderFutureNum)) {
                        this.moneyPlace.reset()
                    } else {
                        text.style.fill = 0xffffff
                        text.text = this.orderFutureNum
                    }
                    return Math.min(+num, this.MAX_ORDER_FUTURE_NUM, this.gamenumbersLength)
                }
                this.moneyPlace.reset = () => {
                    this.orderFutureNum = 0
                    text.text = this.$t('table_001')
                    text.style.fill = fill
                }
                const text = new Text({ text: this.$t('table_001'), style, x: 816, y: 683, p })
                const plugBtn = new Button({ id: 'place', key: 'plug', x: 919, y: 681, width: 55, height: 60, anchor: {x: 0.5, y: 0.5}, p }, {
                    down: { width: 60, height: 65 },
                    up: {
                        width: 55,
                        height: 60,
                        fn: () => {
                            this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                            const num = this.moneyPlace.setNum(this.orderFuture ? this.orderFutureNum + 1 : 2)
                        } },
                    out: { width: 55, height: 60 }
                })
                const lessBtn = new Button({ id: 'place', key: 'less', x: 709, y: 681, width: 55, height: 60, anchor: {x: 0.5, y: 0.5}, p }, {
                    down: { width: 60, height: 65 },
                    up: {
                        width: 55,
                        height: 60,
                        fn: () => {
                            this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                            if (this.orderFuture) {
                                const num = this.moneyPlace.setNum(this.orderFutureNum - 1)
                            }
                        } },
                    out: { width: 55, height: 60 }
                })
            }
        },
        drawColdDown() {
            const p = new Container(this.container, {name: 'ColdDown'})
            const place = new Sprite({ id: 'place', key: 'coldDown', x: 207, y: 3.2, p })
            let style = {
                fontFamily: 'Comic Sans MS',
                fontSize: 36,
                fill: '#fff',
                stroke: '#1486ba',
                strokeThickness: 3,
                letterSpacing: 2,
                dropShadow: true,
                dropShadowColor: '#1486ba',
                dropShadowBlur: 1,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 2
            }
            this.coldDown = new Text({ style, x: 310, y: 45, p })
            style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 18,
                fill: '#fff',
                stroke: '#164982',
                strokeThickness: 2,
                fontWeight: 'bold',
                dropShadow: true,
                dropShadowColor: '#164982',
                dropShadowBlur: 1,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 1
            }
            this.issue = new Text({ text: this.$t('common_001', {'0': this.number}), style, x: 310, y: 20, p })
        },
        drawMoneyArea() {
            const p = this.moneyArea = new Container(this.container, {name: 'MoneyArea', y: this.isShowOrderFutureButton ? 0 : 22})
            const style = { fontFamily: 'Microsoft Yahei', fill: '#ffffff', fontSize: 18 }
            const money = new TextBG({x: 820, y: 640, p, style}, { x: 750, y: 624, width: 135, alpha: 0.25, bgColor: 0x000000 })
            this.updateLtMoneyAmout()
        },
        drawBubble() {
            const num = Math.random() * 5
            for (var i = 0; i < num; i++) {
                const time = Math.floor(Math.random() * 3000)
                clearTimeout(this.bubbleTimer[i])
                this.bubbleTimer[i] = setTimeout(() => this.drawBubbleMove(), time)
            }
        },
        drawBubbleMove() {
            for (var i = 0; i < 3; i++) {
                const time = Math.floor(Math.random() * 10)
                const width = window.innerWidth
                const height = window.innerHeight
                const idx = Math.floor(Math.random() * 3 + 1)
                const imgSize = 20 / idx
                const imgR = Math.random() * 60 + 10
                const imgX = Math.floor(Math.random() * width)
                const imgY = Math.floor(Math.random() * height)
                const imgToY = Math.random()
                const imgToX = imgX + imgR
                const bubbleImg = new Sprite({id: 'bubbleImg', width: imgSize, height: imgSize, x: imgX, y: imgToY, p: this.root.bubble})
                TweenMax.to(bubbleImg, time, {x: imgToX,
                    y: imgY,
                    alpha: 0.5,
                    onComplete: () => {
                        bubbleImg.destroy()//完成動畫後銷毀物件
                    }})
            }
        },
        // 更新連投區域
        changeMutiArea(open) {
            if (open) {
                // 初始狀態空值處理,避免報錯
                this.moneyArea && (this.moneyArea.y = 0)
                if (this.muti === undefined) {
                    this.drawMutiPlace()
                }
                this.muti.visible = true
            } else {
                this.moneyArea.y = 22
                this.muti.visible = false
            }
        }
    }
}
</script>