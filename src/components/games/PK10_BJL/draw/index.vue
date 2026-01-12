<script>
import drag from '@C/pixi/drag'
import Sprite from '@C/pixi/components/Sprite'
import Text from '@C/pixi/components/Text'
import TextBG from '@C/pixi/components/TextBG'
import Button from '@C/pixi/components/Button'
import Container from '@C/pixi/components/Container'
import Graphics from '@C/pixi/components/Graphics'
import CurvedText from '@C/pixi/components/CurvedText'
import ButtonMixin from '@C/pixi/components/ButtonMixin'

// import * as PIXI from 'pixi.js'

export default {
    name: 'draw',
    beforeMount() {
        this.drawFnFlow.push(
            this.drawBg,
            this.drawTip,
            this.drawLottery,
            this.drawMoneyPlace,
            // this.drawMutiPlace,
            this.drawColdDown,
            this.drawMoneyArea
        )
        this.resourceArr.push(
            { id: 'bg', file: 'bg.png' },
            // { id: 'bg4', file: 'bg4.png' }, // 走勢圖
            { id: 'BJL_girl', file: 'BJL_girl.png' },
            { id: 'table', file: 'table.png' },
            { id: 'place', file: 'place/sp.json' },
            { id: 'lotteryIcon', file: 'lotteryIcon.png' },
            // 背景音樂
            { id: 'PK10_BJL_bg', file: 'PK10_BJL_v1.mp3', isSound: true },
            // 音效
            { id: 'ba_click', file: 'ba_click.mp3', isSound: true }, // 點擊連投加減號
            { id: 'PK10_Poker', file: 'PK10_Poker.mp3', isSound: true }, // 牌
            { id: 'PK10_Poker_R', file: 'PK10_Poker_R.mp3', isSound: true }, // 收牌
            { id: 'BJL_open', file: 'BJL_open.mp3', isSound: true } // 牌
        )
        // 彩種圖一次加載
        // this.lotteryListTable[gameType].childs.forEach((lottery) => {
        //     this.resourceArr.push({
        //         id: `lottery${lottery.lottery}`,
        //         file: `c_lottery--${lottery.lottery}.svg`,
        //         urlPath: `${CDN}/static/image/lang_${this.lang}/c_lottery-category/c_lottery-class--${gameType}/`
        //     })
        // })
    },
    methods: {
        drawBg() {
            const p = new Container(this.container, {name: 'Bg'})
            // 桌子
            this.root.bg = new Sprite({id: 'bg', p: this.root})
            const girl = new Sprite({ id: 'BJL_girl', x: 538.6, y: -11, p })
            const table = new Sprite({ id: 'table', x: 175, y: 169, p, width: 950, alpha: 0.85 })
            const tableMiddleLine = new Graphics(p, {x: 646, y: 215})
            tableMiddleLine
                .lineStyle(1, 0xffffff)
                .lineTo(0, 40) //畫一個紅色方塊
            // 背景音樂
            this.setSoundOptionAndPlay('PK10_BJL_bg', {
                volume: 0.5,
                loop: true
            })
            // 底層對焦用
            // const bg22 = new Sprite({id: 'BJL_open', p})
            // drag(bg22)
        },
        drawTip() {
            const p = this.tip = new Container(this.container, {name: 'Tip', zIndex: 98, alpha: 0})
            const style = {
                fill: '#ffffff',
                fontSize: 18
            }
            const text = new TextBG(
                {x: 640, y: 581, p, style},
                {paddingW: 50, alpha: 0.75, radius: 15}
            )
        },
        drawLottery() {
            const p = new Container(this.container, {name: 'Lottery'})
            const lotteryBtn = new Button({ id: 'lotteryIcon', x: 5.8, y: 0, p }, {
                up: {
                    fn: () => {
                        this.$router.push('/')
                    }
                }
            })
            const fontSize = {
                vn: 11,
                th: 12,
                us: 12
            }
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 15,
                fill: '#232037',
                fontWeight: 'bold',
                stroke: '#00ffff',
                strokeThickness: 0.75
            }
            style.fontSize = fontSize[this.lang] || 15
            const lotteryName = new CurvedText({ p: lotteryBtn, text: this.$t(this.getLotterySName(this.lotteryNameKey)), x: 94, y: 266, style, anchor: {x: 0.5, y: 0.5} })
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
                            btn.rotation = 0
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

            const moneyPlace = new Sprite({ id: 'place', key: 'BJL_money_place', x: 829, y: 10, p })
            const moneySymbol = new Sprite({ id: 'place', key: 'BJL_money', x: 845, y: 33, p })
            // 右上角金額更新按鈕
            const moneyUpdateBtn = new Button({ id: 'place', key: 'BJL_money_reload', x: 1120, y: 50, anchor: {x: 0.5, y: 0.5}, p })
            const style = { fontSize: 32, fill: '#fff' }
            this.balance = new Text({ text: this.getBalance, style, x: 993, y: 50, p })
        },
        drawColdDown() {
            const p = new Container(this.container, {name: 'ColdDown'})
            const place = new Sprite({ id: 'place', key: 'BJL_timer_place', x: 215, y: 32, p })
            let style = {
                fontFamily: 'Comic Sans MS',
                fontSize: 36,
                fill: '#fff',
                stroke: '#0f6e68',
                strokeThickness: 3,
                letterSpacing: 2,
                dropShadow: true,
                dropShadowColor: '#0f6e68',
                dropShadowBlur: 1,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 2
            }
            this.coldDown = new Text({ style, x: 144, y: 66, p: place })
            style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 18,
                fill: '#fff',
                stroke: '#0f6e68',
                strokeThickness: 2,
                fontWeight: 'bold',
                dropShadow: true,
                dropShadowColor: '#0f6e68',
                dropShadowBlur: 1,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 1
            }
            this.issue = new Text({ text: this.$t('common_001', {'0': this.number}), style, x: 144, y: 28, p: place })
        },
        drawMoneyArea() {
            const p = this.moneyArea = new Container(this.container, {name: 'MoneyArea'})
            const style = { fontFamily: 'Microsoft Yahei', fill: '#ffffff', fontSize: 18 }
            const money = new TextBG({ x: 823, y: 661, p, style },
                { x: 760, y: 646, width: 135, alpha: 0.25, bgColor: 0x000000 })
            this.updateLtMoneyAmout()
        },
        // 更新連投區域
        changeMutiArea(open) {
            // if (open) {
            //     // 初始狀態空值處理,避免報錯
            //     this.moneyArea && (this.moneyArea.y = 0)
            //     if (this.muti === undefined) {
            //         this.drawMutiPlace()
            //     }
            //     this.muti.visible = true
            // } else {
            //     this.moneyArea.y = 22
            //     this.muti.visible = false
            // }
        }
    }
}
</script>