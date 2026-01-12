<script>
import { mapGetters, mapActions } from 'vuex'
import drag from '@C/pixi/drag'
import Container from '@C/pixi/components/Container'
import Scrollbox from '@C/pixi/components/Scrollbox'
import Graphics from '@C/pixi/components/Graphics'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Text from '@C/pixi/components/Text'

// import * as PIXI from 'pixi.js'

export default {
    name: 'drawBetSuccess',
    data() {
        return {
            successTimer: null
        }
    },
    beforeMount() {
        // this.drawFnFlow.push(
        //     this.drawBetSuccess
        // )
        this.resourceArr.push(
            { id: 'betSuccess', file: 'betSuccess/sp.json', urlPath: `${CDN}/static/pixi/share/` },
            // 音效
            { id: 'WIN', file: 'WIN.mp3', isSound: true } // 投注成功
        )
    },
    methods: {
        drawBetSuccess(num) {
            const p = new Container(this.front, {name: 'betSuccess', alpha: 0})
            const bg = new Button({ id: 'betSuccess', key: 'bg01', x: 0, y: 0, p })
            bg.eventOff()
            bg.buttonMode = false
            const girl = new Sprite({ id: 'betSuccess', key: 'bg02', x: 180, y: 0, p })
            this.mask.show()
            this.drawSuccessNum(p, num)
            this.drawSuccessTitle(p)
            this.drawKeepBet(p)
            TweenMax.to(p, 0.4, {alpha: 1})
            clearTimeout(this.successTimer)
            this.successTimer = setTimeout(() => p.destroy({children: true}, this.mask.hide()), 3000)
        },
        drawSuccessNum(p, number) {
            const content = new Container(p, {name: 'betNum', x: 515, y: 350})
            const bg = new Sprite({ id: 'betSuccess', key: 'num_bg', x: 0, y: 0, p: content })
            let style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 30,
                fontWeight: 'bold',
                fill: ['#fff', '#a3a2a0', '#fff'],
                fillGradientStops: [0.3, 0.6, 0.6],
                //stroke: '#752118',
                //strokeThickness: 5,
                dropShadow: true,
                dropShadowColor: '#000',
                dropShadowBlur: 3,
                dropShadowAngle: Math.PI / 2,
                dropShadowDistance: 3
            }
            const num = new Text({ text: number, style, x: 0, y: 14, p: content, anchor: {x: 0, y: 0} })
            num.x = 159 - (num.width / 2)
        },
        drawSuccessTitle(p) {
            this.setSoundOptionAndPlay('WIN', {volume: 0.5})
            const content = new Container(p, {name: 'title', x: 500, y: 170})
            const langSize = {
                cn: 90,
                us: 60,
                th: 75,
                vn: 65,
                jp: 70
            }
            let style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: langSize[this.lang],
                fontWeight: 'bold',
                fill: ['#eed883', '#fff', '#b5812b', '#fdfce9', '#f0db89'],
                fillGradientStops: [0, 0.3, 0.4, 0.4, 1],
                stroke: '#efef7f',
                strokeThickness: 5,
                align: 'center',
                dropShadow: true,
                dropShadowColor: '#4b1120',
                dropShadowBlur: 2,
                dropShadowAngle: Math.PI / 2,
                dropShadowDistance: 9,
                // 中文不換行
                breakWords: this.lang !== 'cn',
                wordWrap: this.lang !== 'cn',
                wordWrapWidth: 400,
                lineHeight: langSize[this.lang] * 0.95
            }
            const title = new Text({ text: this.$t('Bet_024_0002'), style, x: 0, y: 18, p: content, anchor: {x: 0, y: 0} })
            const light = new Sprite({ id: 'betSuccess', key: 'text_light', x: 0, y: 13, p: content })
            title.x = 170 - (title.width / 2)
            title.y = 70 - (title.height / 2)
        },
        drawKeepBet(p) {
            const keepBtn = new Button({ id: 'betSuccess', key: 'btn_active', x: 665, y: 597, anchor: {x: 0.5, y: 0.5}, p }, {
                down: { scale: {x: 0.9, y: 0.9} },
                up: {
                    scale: {x: 1, y: 1},
                    fn: () => {
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        p.destroy({children: true})
                        clearTimeout(this.successTimer)
                        this.mask.hide()
                    }
                },
                out: {
                    scale: {x: 1, y: 1}
                }
            })
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: this.lang === 'cn' ? 30 : 24,
                fill: '#ffffff',
                fontWeight: 'bold',
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 2,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 3
            }
            const keepText = new Text({ text: this.$t('popup_021'), style, x: 0, y: 0, p: keepBtn, anchor: {x: 0.5, y: 0.5} })
            // keepText.x = (keepBtn.width / 2) - (keepText.width / 2)
        }
    }
}
</script>