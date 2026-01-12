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
                { x: 168, y: 600 },
                { x: 252, y: 600 },
                { x: 336, y: 600 },
                { x: 420, y: 600 },
                { x: 504, y: 600 },
                { x: 586, y: 600 }
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
                p.zIndex = 2
                this.mask.hide(p)
            }
            const show = () => {
                p.zIndex = 100
                this.mask.show(p)
            }
            const place = new Sprite({ id: 'coin', key: 'place', x: 145, y: 585, p })
            let customPlace
            let coin = this.coins
            let customCoin = []

            // 永遠都產生5個硬幣物件, 沒有存在coinIndex裡頭的就設成不顯示
            Array(5).fill(0).forEach((zero, i) => {
                const money = this.coinArr[this.coinIndex[i] || 0]
                const key = `$${money}`
                const { x, y } = this.coinPosArr2[i]

                coin[i] = new Button({ id: 'coin', key, x, y, p }, {
                    up: { fn: () => {
                        this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                        clearTimeout(this.timer) // 取消3秒後出現常駐的'請選擇撤銷的區塊'
                        // 開啟設定籌碼區塊, 點擊原本的籌碼->取消設定
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
                        } else {
                            if (coin[this.moneyIndex]) {
                                TweenMax.to(coin[this.moneyIndex].pivot, 0.3, {y: 0})
                            }
                            this.tempMoneyIndex = -1
                            this.isEraser && this.handleEraser()
                            this.moneyIndex = i
                            TweenMax.to(coin[i].pivot, 0.3, {y: 20})
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
            custom = new Button({ id: 'coinLang', key: 'c', x, y, p }, {
                up: { fn: () => {
                    this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                    this.isEraser && this.handleEraser()
                    custom.visible = false
                    finish.visible = true
                    show()
                    this.moneyIndex !== -1 && TweenMax.to(coin[this.moneyIndex].pivot, 0.3, {y: 0})
                    customPlace = new Sprite({ id: 'coin', key: 'customPlace', x: 153, y: 473, p })
                    // 設定硬幣
                    coinsTemp = [...this.coinIndex]
                    this.coinArr.forEach((key, i) => {
                        const { x, y } = this.coinPosArr[i]
                        key = this.coinIndex.includes(i) ? `c$${key}` : `n$${key}`
                        customCoin[i] = new Button({ id: 'coin', key, x, y, p: customPlace }, {
                            up: { fn: setCoin.bind(null, i) }
                        })
                    })
                    const closeCustomBtn = new Button({ id: 'coin', key: 'closeCustomBtn', x: 680, y: -20, p: customPlace }, {
                        up: { fn: () => {
                            this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                            customPlace.destroy({children: true})
                            finish.visible = false
                            custom.visible = true
                            hide()
                            if (!this.moneyIndex) {
                                TweenMax.to(coin[this.moneyIndex].pivot, 0.3, {y: 20})
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
                        }
                    })
                    if (!this.moneyIndex) {
                        TweenMax.to(coin[this.moneyIndex].pivot, 0.3, {y: 20})
                    } else {
                        coin[0].fnData.up.fn()
                    }
                }}
            })
        }
    }
}
</script>