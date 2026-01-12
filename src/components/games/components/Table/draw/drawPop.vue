<script>
import drag from '@C/pixi/drag'
import Container from '@C/pixi/components/Container'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Text from '@C/pixi/components/Text'
import MutiText from '@C/pixi/components/MutiText'
export default {
    name: 'drawPop',
    beforeMount() {
        this.resourceArr.push(
            { id: 'pop', file: 'sp.json', urlPath: `${CDN}/static/pixi/share/pop/` }
        )
        this.$root.$on('drawPop', this.drawPop)
    },
    beforeDestroy() {
        this.$root.$off('drawPop', this.drawPop)
    },
    methods: {
        drawPop(options = {}) {
            // 如果已經存在彈窗則銷毀
            if (this.pop) {
                this.pop.destroy({children: true})
            } else {
                this.mask.show()
            }
            this.pop = new Container(this.front, {name: 'pop'})
            //背景圖
            const p = new Sprite({ id: 'pop', key: 'pop', x: 640, y: 384, p: this.pop, anchor: {x: 0.5, y: 0.5}, scale: { x: 0.9, y: 0.9 } })
            //標題
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 34,
                fontWeight: 'bold',
                fill: '#ffffff'
                // fill: ['#eed883', '#fff', '#e1c073', '#fdfce9', '#f0db89'],
                // stroke: '#752118',
                // strokeThickness: 3,
                // dropShadow: true,
                // dropShadowColor: '#752118',
                // dropShadowBlur: 1,
                // dropShadowAngle: Math.PI / 2,
                // dropShadowDistance: 2
            }
            // 溫馨提示
            const headTitle = new Text({ text: this.$t(options.title), style, p, y: -145 })
            this.drawPopContent(p, options)
            this.drawPopBtn(p, options)
            TweenMax.to(p.scale, 0.2, {x: 1, y: 1})
        },
        drawPopContent(p, {message, content, isMessageMuti, messageParam}) {
            const x = -230
            let y = -110
            let style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 24,
                fill: '#ba8f0e',
                stroke: '#000',
                strokeThickness: 1,
                fontWeight: 'bold',
                wordWrap: true,
                wordWrapWidth: 465,
                breakWords: true
            }
            if (message) {
                const titleText = new Text({ text: messageParam ? this.$t(message, messageParam) : this.$t(message), style, p, x, y, anchor: {x: 0, y: 0} })
                y += titleText.height + 11
            }
            style.fontSize = 20
            style.fill = '#fff'

            if (content) {
                if (isMessageMuti) {
                    style.wordWrap = false
                    const red = {
                        ...style,
                        fill: '#ff7bac'
                    }
                    const styles = {
                        default: style,
                        red
                    }
                    const contentText = new MutiText({ text: content, p, x, y, anchor: {x: 0, y: 0} }, styles)
                } else {
                    const contentText = new Text({ text: this.$t(content), style, p, x, y, anchor: {x: 0, y: 0} })
                }
            }
            // drag(title)
        },
        drawPopBtn(p, options) {
            const {
                beforeClose,
                beforeConfirm,
                beforeCancel,
                afterClose,
                afterConfirm,
                afterCancel,
                isShowCloseIcon,
                isShowConfirmBtn,
                isShowCancelBtn,
                confirmText,
                cancelText
            } = options
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 30,
                fill: '#fff',
                fontWeight: 'bold',
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 2,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 3
            }
            //按鈕
            const y = 117
            let x = -3
            if (isShowConfirmBtn && isShowCancelBtn) {
                x = -135
            }
            if (isShowConfirmBtn) {
                const btn_submit = new Button({ id: 'pop', key: 'btn_active', x, y, anchor: {x: 0.5, y: 0.5}, p }, {
                    down: { scale: {x: 0.9, y: 0.9} },
                    up: {
                        scale: {x: 1, y: 1},
                        fn: async () => {
                            this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                            btn_submit.eventOff()
                            const res = await beforeConfirm(this)
                            if (!res) {
                                this.mask.hide()
                                this.pop.destroy({children: true})
                                this.pop = null
                                afterConfirm(this)
                            } else {
                                btn_submit.eventOn()
                            }
                        }
                    },
                    out: { scale: {x: 1, y: 1} }
                })
                const submit_text = new Text({ text: this.$t(confirmText), style, x: 0, y: 0, p: btn_submit })
                x = 0
            }
            if (isShowCancelBtn) {
                const btn_cancel = new Button({ id: 'pop', key: 'btn_default', x, y, anchor: {x: 0.5, y: 0.5}, p }, {
                    down: { scale: {x: 0.9, y: 0.9} },
                    up: {
                        scale: {x: 1, y: 1},
                        fn: async () => {
                            this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                            const res = await beforeCancel(this)
                            if (!res) {
                                this.mask.hide()
                                this.pop.destroy({children: true})
                                this.pop = null
                                afterCancel(this)
                            } else {
                                btn_cancel.eventOn()
                            }
                        }
                    },
                    out: { scale: {x: 1, y: 1} }
                })
                const cancel_text = new Text({ text: this.$t(cancelText), style, x: 0, y: 0, p: btn_cancel })
            }
        }
    }
}
</script>