<script>
import drag from '@C/pixi/drag'
import Text from '@C/pixi/components/Text'
import Button from '@C/pixi/components/Button'
import Sprite from '@C/pixi/components/Sprite'
// import * as PIXI from 'pixi.js'

export default {
    name: 'drawButton',
    beforeMount() {
        this.drawFnFlow.push(
            this.drawClearBtn,
            // this.drawFastBtn,
            this.drawRemoveBtn,
            this.drawOrderBtn,
            this.drawDobuleBtn
        )
        this.resourceArr.push(
            { id: 'btn', file: 'btn/sp.json' }
        )
    },
    methods: {
        // 清空
        drawClearBtn() {
            const p = this.container
            this.clearBtn = new Button({ id: 'btn', key: 'BJL_Button2', x: 1125, y: 381, scale: {x: 0.73, y: 0.73}, p }, {
                down: { textureID: 'BJL_Button2_c' },
                up: {
                    fn: () => {
                        this.setSoundOptionAndPlay('gold_move', {volume: 0.5})
                        this.handleReset()
                    },
                    textureID: 'BJL_Button2'
                },
                out: { textureID: 'BJL_Button2' }
            })
            this.clearBtn.eventOff()
            if (this.lang === 'cn') {
                const style = { fontSize: 40, fill: '#fff', fontFamily: 'Microsoft Yahei', fontWeight: 'bold' }
                const text = new Text({ text: '清', anchor: { x: 0.5, y: 0.5 }, style, x: 100, y: 99, p: this.clearBtn })
            } else {
                const key = `BJL_Clear`
                const symbol = new Sprite({ id: 'btn', key, anchor: { x: 0.5, y: 0.5 }, x: 100, y: 99, p: this.clearBtn })
            }
        },
        // 快投
        // drawFastBtn() {
        //     const p = this.container
        //     this.fastBtn = new Button({ id: 'btnLang', key: 'f', x: 1140.5, y: 281, p })
        // },
        // 撤
        drawRemoveBtn() {
            const p = this.container
            this.removeBtn = new Button({ id: 'btn', key: 'BJL_Button2', x: 23, y: 560, scale: {x: 0.73, y: 0.73}, p }, {
                down: { textureID: 'BJL_Button2_c' },
                up: {
                    fn: () => {
                        if (this.isEraser) {
                            // 取消橡皮擦模式 的時候放音效
                            this.setSoundOptionAndPlay('ba_chipselect', {volume: 0.5})
                            clearTimeout(this.timer)
                        } else {
                            // 開啟橡皮擦模式 '请选择撤销投注的区块'
                            this.tip.text.show(this.$t('Glory_3001'))
                        }

                        this.handleEraser()
                    },
                    textureID: 'BJL_Button2'
                },
                out: { textureID: 'BJL_Button2' }
            })
            if (this.lang === 'cn') {
                const style = { fontSize: 40, fill: '#fff', fontFamily: 'Microsoft Yahei', fontWeight: 'bold' }
                const text = new Text({ text: '撤', anchor: { x: 0.5, y: 0.5 }, style, x: 100, y: 99, p: this.removeBtn })
            } else {
                const key = `BJL_Remove`
                const symbol = new Sprite({ id: 'btn', key, anchor: { x: 0.5, y: 0.5 }, x: 100, y: 99, p: this.removeBtn })
            }
        },
        // 橡皮擦模式處理
        handleEraser() {
            this.isEraser = !this.isEraser
            if (this.isEraser) {
                if (this.moneyIndex > -1) {
                    this.tempMoneyIndex = this.moneyIndex
                    const coin = this.coins[this.moneyIndex]
                    coin.fnData.up.fn()
                }
                this.creditGameLtProjectVal
                    .forEach(({key}) => {
                        const method = this.spritesTemp[key]
                        method.drawEraserTexture()
                    })
                // this.removeBtn.setTextureKey('removec')
                this.buttonSwitch({order: false, double: false, clear: false})
            } else {
                if (this.tempMoneyIndex > -1) {
                    const coin = this.coins[this.tempMoneyIndex]
                    coin.fnData.up.fn()
                }
                this.creditGameLtProjectVal
                    .forEach(({key}) => {
                        const method = this.spritesTemp[key]
                        method.updateStaus()
                    })
                this.hideTip('Glory_3001')
                // this.removeBtn.setTextureKey('remove')
                if (this.ltProjectNum) {
                    this.buttonSwitch({order: true, double: true, clear: true})
                }
            }
        },
        // 投注
        drawOrderBtn() {
            const p = this.container
            this.orderBtn = new Button({ id: 'btn', key: 'BJL_Button2', x: 1063.5, y: 514, p }, {
                down: { textureID: 'BJL_Button2_c' },
                up: {
                    fn: () => {
                        this.setSoundOptionAndPlay('Click17', {volume: 0.5})
                        this.handleSubmit()
                    },
                    textureID: 'BJL_Button2'
                },
                out: { textureID: 'BJL_Button2' }
            })
            this.orderBtn.eventOff()
            if (this.lang === 'cn') {
                const style = { fontSize: 32, fill: '#fff', fontFamily: 'Microsoft Yahei', fontWeight: 'bold' }
                const text = new Text({ text: '投注', anchor: { x: 0.5, y: 0.5 }, style, x: 100, y: 99, p: this.orderBtn })
            } else {
                const langKey = this.lang === 'jp' ? 'us' : this.lang
                const key = `BJL_Bet_${langKey}`
                const symbol = new Sprite({ id: 'btn', key, anchor: { x: 0.5, y: 0.5 }, x: 100, y: 99, p: this.orderBtn })
            }
        },
        // 翻
        drawDobuleBtn() {
            const p = this.container
            this.dobuleBtn = new Button({ id: 'btn', key: 'BJL_Button2', x: 921, y: 559, scale: {x: 0.73, y: 0.73}, p }, {
                down: { textureID: 'BJL_Button2_c' },
                up: {
                    textureID: 'BJL_Button2',
                    fn: () => {
                        this.handleDobule()
                        this.setSoundOptionAndPlay('ba_chipput', {volume: 0.5})
                    }
                },
                out: { textureID: 'BJL_Button2' }
            })
            this.dobuleBtn.eventOff()
            if (this.lang === 'cn') {
                const style = { fontSize: 40, fill: '#fff', fontFamily: 'Microsoft Yahei', fontWeight: 'bold' }
                const text = new Text({ text: '翻', anchor: { x: 0.5, y: 0.5 }, style, x: 100, y: 99, p: this.dobuleBtn })
            } else {
                const key = `BJL_double`
                const symbol = new Sprite({ id: 'btn', key, anchor: { x: 0.5, y: 0.5 }, x: 100, y: 99, p: this.dobuleBtn })
            }
        },
        /**
         * 控制按鈕組開關
         * @param {boolean} options.order 開啟/關閉 投注按鈕
         * @param {boolean} options.double 開啟/關閉 翻倍按鈕
         * @param {boolean} options.clear 開啟/關閉 清空按鈕
         */
        buttonSwitch(options = {}) {
            const action = {
                order: {
                    on: () => {
                        this.orderBtn.eventOn()
                    },
                    off: () => {
                        this.orderBtn.eventOff()
                    }
                },
                double: {
                    on: () => {
                        this.dobuleBtn.eventOn()
                    },
                    off: () => {
                        this.dobuleBtn.eventOff()
                    }
                },
                clear: {
                    on: () => {
                        this.clearBtn.eventOn()
                    },
                    off: () => {
                        this.clearBtn.eventOff()
                    }
                }
            }

            Object.keys(options).forEach((btnName) => {
                const isOn = options[btnName]
                isOn ? action[btnName].on() : action[btnName].off()
            })
        }
    }
}
</script>