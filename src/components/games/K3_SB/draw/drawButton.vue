<script>
import drag from '@C/pixi/drag'
import Button from '@C/pixi/components/Button'
// import * as PIXI from 'pixi.js'

export default {
    name: 'drawButton',
    data() {
        return {
            // trendBalls: []
        }
    },
    beforeMount() {
        this.drawFnFlow.push(
            this.drawClearBtn,
            // this.drawFastBtn,
            this.drawRemoveBtn,
            this.drawOrderBtn,
            this.drawDobuleBtn
        )
        switch (this.lang) {
            case 'cn': this.fileLang = 'lang/btn/sp_cn.json'
                break
            case 'us': this.fileLang = 'lang/btn/sp_us.json'
                break
            case 'th': this.fileLang = 'lang/btn/sp_th.json'
                break
            case 'vn': this.fileLang = 'lang/btn/sp_vn.json'
                break
            case 'jp': this.fileLang = 'lang/btn/sp_jp.json'
                break
        }
        this.resourceArr.push(
            { id: 'btn', file: 'btn/sp.json' },
            { id: 'btnLang', file: this.fileLang }
        )
    },
    methods: {
        // 清
        drawClearBtn() {
            const p = this.container
            this.clearBtn = new Button({ id: 'btnLang', key: 'cleard', x: 1140.5, y: 391.5, p }, {
                down: { textureID: 'clearc' },
                up: {
                    fn: () => {
                        this.setSoundOptionAndPlay('gold_move', {volume: 0.5})
                        this.handleReset()
                    },
                    textureID: 'clear'
                },
                out: { textureID: 'clear' }
            })
            this.clearBtn.eventOff()
        },
        // 快投
        drawFastBtn() {
            const p = this.container
            this.fastBtn = new Button({ id: 'btnLang', key: 'f', x: 1148.6, y: 261.2, p })
        },
        // 撤
        drawRemoveBtn() {
            const p = this.container
            this.removeBtn = new Button({ id: 'btnLang', key: 'remove', x: 5.4, y: 568.8, p }, {
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
                    }
                }
            })
        },
        // 投注
        drawOrderBtn() {
            const p = this.container
            this.orderBtn = new Button({ id: 'btnLang', key: 'orderd', x: 1084.6, y: 524.7, p }, {
                down: { textureID: 'orderc' },
                up: {
                    fn: () => {
                        this.setSoundOptionAndPlay('Click17', {volume: 0.5})
                        this.handleSubmit()
                    },
                    textureID: 'order'
                },
                out: { textureID: 'order' }
            })
            this.orderBtn.eventOff()
        },
        // 翻
        drawDobuleBtn() {
            const p = this.container
            this.dobuleBtn = new Button({ id: 'btnLang', key: 'doubled', x: 944.7, y: 571.5, p }, {
                down: { textureID: 'doublec' },
                up: {
                    fn: () => {
                        this.setSoundOptionAndPlay('ba_chipput', {volume: 0.5})
                        this.handleDobule()
                    },
                    textureID: 'double'
                },
                out: { textureID: 'double' }
            })
            this.dobuleBtn.eventOff()
        }
    }
}
</script>