<script>
import drag from '@C/pixi/drag'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Container from '@C/pixi/components/Container'

// import * as PIXI from 'pixi.js'

export default {
    name: 'drawCoin',
    data() {
        return {
            coinPosArr: [
                { x: 20, y: 16 },
                { x: 88, y: 16 },
                { x: 156, y: 16 },
                { x: 224, y: 16 },
                { x: 292, y: 16 },
                { x: 360, y: 16 },
                { x: 428, y: 16 },
                { x: 496, y: 16 },
                { x: 564, y: 16 },
                { x: 632, y: 16 }
            ],
            coinPosArr2: [
                { x: 168, y: 607 },
                { x: 252, y: 607 },
                { x: 336, y: 607 },
                { x: 420, y: 607 },
                { x: 504, y: 607 },
                { x: 586, y: 607 }
            ]
        }
    },
    beforeMount() {
        this.drawFnFlow.push(
            this.drawCoin
        )
        const file = this.lang === 'cn' ? 'lang/coin/sp_cn.json' : 'lang/coin/sp_us.json'
        this.resourceArr.push(
            { id: 'coin', file: 'coin/sp.json' },
            { id: 'coinLang', file }
        )
    },
    methods: {
        drawCoin() {
            const p = new Container(this.container, {name: 'Coin', zIndex: 2})
            const hide = () => {
                this.mask.hide(p)
                p.zIndex = 2
            }
            const show = () => {
                this.mask.show(p)
                p.zIndex = 100
            }
            const place = new Sprite({ id: 'coin', key: 'place', x: 133, y: 600, p })
            let customPlace
            let coin = this.coins
            let customCoin = []

            // 永遠都產生5個硬幣物件, 沒有存在coinIndex裡頭的就設成不顯示
            Array(5).fill(0).forEach((zero, i) => {
                const money = this.coinArr[this.coinIndex[i] || 0]
                const key = `$${money}`
                const { x, y } = this.coinPosArr2[i]

                coin[i] = new Button({ id: 'coin', key, x, y, alpha: 0.5, p }, {
                    up: { fn: () => {
                        this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                        clearTimeout(this.timer) // 取消3秒後出現常駐的'請選擇撤銷的區塊'
                        if (p.zIndex === 100) {
                            customPlace.destroy({children: true})
                            finish.visible = false
                            custom.visible = true
                            hide()
                            this.moneyIndex = -1
                            coin[i].fnData.up.fn()
                            return
                        }
                        if (this.moneyIndex === i) {
                            TweenMax.to(coin[i].pivot, 0.3, { y: 0 })
                            //  += 20
                            this.moneyIndex = -1
                            coin[i].alpha = 0.5
                        } else {
                            if (coin[this.moneyIndex]) {
                                TweenMax.to(coin[this.moneyIndex].pivot, 0.3, {y: 0})
                                coin[this.moneyIndex].alpha = 0.5
                            }
                            this.tempMoneyIndex = -1
                            this.isEraser && this.handleEraser()
                            this.moneyIndex = i
                            TweenMax.to(coin[i].pivot, 0.3, {y: 10})
                            coin[i].alpha = 1
                        }
                    }}
                })
                this.coinIndex[i] === undefined && (coin[i].visible = false)
            })
            coin[0].fnData.up.fn()
            const { x, y } = this.coinPosArr2[5]
            let custom
            let finish
            // 自定義
            let coinsTemp
            const setCoin = (i) => {
                let key
                const index = coinsTemp.indexOf(i)

                if (index > -1) {
                    key = `n$${this.coinArr[i]}`
                    coinsTemp.splice(index, 1)
                    customCoin[i].setTextureKey(key)
                } else {
                    // 亮起籌碼, 只能亮5個
                    if (coinsTemp.length < 5) {
                        // 只有亮起來的時候有音效
                        this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                        key = `c$${this.coinArr[i]}`
                        coinsTemp = [ ...coinsTemp, i ].sort()
                        customCoin[i].setTextureKey(key)
                    }
                }
            }
            // 設定
            custom = new Button({ id: 'coinLang', key: 'c', x, y, alpha: 0.7, p }, {
                up: { fn: () => {
                    this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                    this.isEraser && this.handleEraser()
                    custom.visible = false
                    finish.visible = true
                    show()
                    this.moneyIndex !== -1 && TweenMax.to(coin[this.moneyIndex].pivot, 0.3, {y: 0}) && TweenMax.to(coin[this.moneyIndex], 0.4, {alpha: 0.5})
                    // coin[this.moneyIndex].alpha = 0.5
                    customPlace = new Sprite({ id: 'coin', key: 'customPlace', x: 108, y: 495, p })
                    // 設定硬幣
                    coinsTemp = [...this.coinIndex]
                    this.coinArr.forEach((key, i) => {
                        const { x, y } = this.coinPosArr[i]
                        key = this.coinIndex.includes(i) ? `c$${key}` : `n$${key}`
                        customCoin[i] = new Button({ id: 'coin', key, x, y, p: customPlace }, {
                            up: { fn: setCoin.bind(null, i) }
                        })
                    })
                    coin[0].alpha = 0.5
                    const closeCustomBtn = new Button({ id: 'coin', key: 'closeCustomBtn', x: 714, y: -23, p: customPlace }, {
                        up: { fn: () => {
                            this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                            customPlace.destroy({children: true})
                            finish.visible = false
                            custom.visible = true
                            hide()
                            if (!this.moneyIndex) {
                                TweenMax.to(coin[this.moneyIndex].pivot, 0.3, {y: 20})
                                coin[0].alpha = 1
                            } else {
                                coin[0].fnData.up.fn()
                            }
                        }}
                    })
                }}
            })
            // 完成
            finish = new Button({ id: 'coinLang', key: 'f', visible: false, x, y, p }, {
                up: { fn: () => {
                    this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                    customPlace.destroy({children: true})
                    finish.visible = false
                    custom.visible = true

                    // 關到全空, coinsTemp自動加入第一個(但還不顯示)
                    if (coinsTemp.length < 1) {
                        coinsTemp = [0]
                    }
                    this.coinIndex = coinsTemp
                    hide()

                    ;[...Array(5)].forEach((k, i) => {
                        const index = this.coinIndex[i]
                        if (isNaN(index)) {
                            coin[i].visible = false
                        } else {
                            coin[i].setTextureKey(`$${this.coinArr[index]}`)
                            coin[i].visible = true
                            coin[0].alpha = 0.6
                        }
                    })
                    if (!this.moneyIndex) {
                        TweenMax.to(coin[this.moneyIndex].pivot, 0.3, {y: 10})
                        TweenMax.to(coin[this.moneyIndex], 0.4, {alpha: 1})
                    } else {
                        coin[0].fnData.up.fn()
                    }
                }}
            })
        }
    }
}
</script>