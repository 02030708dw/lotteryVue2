<script>
import drag from '@C/pixi/drag'
import Text from '@C/pixi/components/Text'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Container from '@C/pixi/components/Container'

// import * as PIXI from 'pixi.js'

export default {
    name: 'drawCoin',
    data() {
        return {
            coinPosArr: [
                { x: 5, y: 20 },
                { x: 81, y: 21 },
                { x: 157, y: 21 },
                { x: 232, y: 21 },
                { x: 308, y: 21 },
                { x: 383, y: 21 },
                { x: 459, y: 21 },
                { x: 535, y: 21 },
                { x: 610, y: 21 },
                { x: 686, y: 21 }
            ],
            coinPosArr2: [
                { x: 178, y: 593 },
                { x: 266, y: 593 },
                { x: 354, y: 593 },
                { x: 442, y: 593 },
                { x: 530, y: 593 },
                { x: 618, y: 593 }
            ]
        }
    },
    beforeMount() {
        this.drawFnFlow.push(
            this.drawCoin
        )
        const file = this.lang === 'cn' ? 'lang/coin/sp_cn.json' : 'lang/coin/sp_us.json'
        this.resourceArr.push(
            { id: 'coin', file: 'coin/sp.json' }
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
            const place = new Sprite({ id: 'coin', key: 'BJL_place', x: 151, y: 571, p })
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
            custom = new Button({ id: 'coin', key: 'customEmpty', x, y, p }, {
                up: { fn: () => {
                    this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                    this.isEraser && this.handleEraser()
                    custom.visible = false
                    finish.visible = true
                    show()
                    this.moneyIndex !== -1 && TweenMax.to(coin[this.moneyIndex].pivot, 0.3, {y: 0})
                    customPlace = new Sprite({ id: 'coin', key: 'BJL_customPlace', x: 143, y: 480, p })
                    // 設定硬幣
                    coinsTemp = [...this.coinIndex]
                    this.coinArr.forEach((key, i) => {
                        const { x, y } = this.coinPosArr[i]
                        key = this.coinIndex.includes(i) ? `c$${key}` : `n$${key}`
                        customCoin[i] = new Button({ id: 'coin', key, x, y, p: customPlace }, {
                            up: { fn: setCoin.bind(null, i) }
                        })
                    })
                    const closeCustomBtn = new Button({ id: 'coin', key: 'closeCustomBtn', x: 743, y: 2, p: customPlace }, {
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
                    drag(closeCustomBtn)
                }}
            })
            if (this.lang === 'cn') {
                const style = { fontSize: 20, fill: '#4d4d4d', fontFamily: 'Microsoft Yahei', fontWeight: 'bold' }
                const text = new Text({ text: '自定', anchor: { x: 0.5, y: 0.5 }, style, x: 44, y: 44.5, p: custom })
            } else {
                const key = `set`
                const symbol = new Sprite({ id: 'coin', key, anchor: { x: 0.5, y: 0.5 }, x: 44, y: 44.5, p: custom })
            }
            // 完成
            finish = new Button({ id: 'coin', key: 'customEmpty', visible: false, x, y, p }, {
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
            if (this.lang === 'cn') {
                const style = { fontSize: 20, fill: '#4d4d4d', fontFamily: 'Microsoft Yahei', fontWeight: 'bold' }
                const text = new Text({ text: '完成', anchor: { x: 0.5, y: 0.5 }, style, x: 44, y: 44.5, p: finish })
            } else {
                const key = `finish`
                const symbol = new Sprite({ id: 'coin', key, anchor: { x: 0.5, y: 0.5 }, x: 44, y: 44.5, p: finish })
            }
        }
    }
}
</script>