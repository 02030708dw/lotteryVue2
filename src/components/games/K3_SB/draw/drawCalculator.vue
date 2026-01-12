<script>
import drag from '@C/pixi/drag'
import Container from '@C/pixi/components/Container'
import Graphics from '@C/pixi/components/Graphics'
import ButtonMixin from '@C/pixi/components/ButtonMixin'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Text from '@C/pixi/components/Text'

export default {
    name: 'drawCalculator',
    data() {
        return {
            calculator: null,
            calculatorData: {
                x: 844,
                y: 191
            },
            // 進入小鍵盤的數字
            originNum: '',
            btnOutFnArr: []
        }
    },
    beforeMount() {
        this.resourceArr.push(
            { id: 'calculator', file: 'calculator/sp.json' }
        )
    },
    methods: {
        destroy() {
            this.mask.hide()
            this.calculatorData.x = this.calculator.x
            this.calculatorData.y = this.calculator.y
            this.calculator.destroy({children: true})
            this.calculator = null
        },
        drawCalculator(value, fn) {
            // 如果已經存在則銷毀
            if (this.calculator) {
                this.destroy()
                return
            }
            this.originNum = value
            this.mask.show()
            // container
            const {x, y} = this.calculatorData
            const p = this.calculator = new Container(this.front, {name: 'calculator', x, y, zIndex: 3})
            const bg = new Sprite({ id: 'calculator', key: 'bg', x: 0, y: 0, p })
            const close = new Button({ id: 'calculator', key: 'close', x: 361, y: 32, anchor: {x: 0.5, y: 0.5}, p }, {
                down: { scale: { x: 0.9, y: 0.9 } },
                up: {
                    scale: { x: 1, y: 1 },
                    fn: () => {
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        // 取消設定
                        fn(this.originNum)
                        this.destroy()
                    }
                },
                out: {
                    scale: { x: 1, y: 1 }
                }
            })

            drag(p, {}, () => {
                // 拖拉結束後, 強制回復樣式, 避免拖曳延遲導致點擊樣式沒有回復
                this.btnOutFnArr.forEach((btnOutFn) => {
                    btnOutFn()
                })
            })
            // 數字框
            const valueBg = new Graphics(p, {name: 'valueBg', x: 330, y: 53})
            const style = {
                fontFamily: 'Arial',
                fontSize: 34,
                fontWeight: 'bold',
                fill: '#003068'
            }
            // 數字
            const text = new Text({text: value, p: valueBg, style: {...style, fontWeight: 'normal', fontSize: 38}, anchor: {x: 1, y: 0}})
            // 按鈕資料
            const buttonArr = [
                [7, 8, 9],
                [4, 5, 6],
                [1, 2, 3],
                ['C', 0, 'OK']
            ]
            const keyFn = (key) => {
                switch (key) {
                    case 'C':
                        text.text = ''
                        value = 0
                        break
                    case 'OK':
                        fn(value)
                        this.destroy()
                        break
                    default:
                        // 避免輸入超過上限
                        value = fn(+('' + value + key))
                        text.text = value
                        break
                }
            }
            // 按鈕
            buttonArr.forEach((arr, i) => {
                const y = 108 + i * 78
                arr.forEach((text, j) => {
                    const x = 26 + j * 110
                    const btnOutFn = () => {
                        btnBg.setTextureKey('keyBtn')
                    }
                    const btn = new ButtonMixin(p, {name: 'swich1', x, y}, {
                        down: {
                            fn: () => {
                                btnBg.setTextureKey('keyBtnc')
                            }
                        },
                        up: {
                            fn: () => {
                                // btnBg.setTextureKey('keyBtn')
                                this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                                keyFn(text)
                            }
                        },
                        out: {
                            // fn: () => {
                            //     btnBg.setTextureKey('keyBtn')
                            // }
                        }
                    })
                    const btnBg = new Sprite({ id: 'calculator', key: 'keyBtn', x: 0, y: 0, p: btn })
                    const key = new Text({text, p: btn, style: ['C', 'OK'].indexOf(text) >= 0 ? {...style, fontSize: 28} : style, x: 55, y: 37})

                    this.btnOutFnArr.push(btnOutFn)
                })
            })
        }
    }
}
</script>