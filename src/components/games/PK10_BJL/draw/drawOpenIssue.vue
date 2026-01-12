<script>
import drag from '@C/pixi/drag'
import Container from '@C/pixi/components/Container'
import Sprite from '@C/pixi/components/Sprite'

// import * as PIXI from 'pixi.js'

export default {
    name: 'drawOpenIssue',
    beforeMount() {
        // this.drawFnFlow.push(
        //     this.drawOpenIssue
        // )
        this.resourceArr.push(
            { id: 'openIssue', file: 'openIssue/sp.json' }
        )
        window.open = this.drawOpenIssue
    },
    methods: {
        drawOpenIssue() {
            const p = new Container(this.container, {name: 'openIssue', zIndex: 5})
            const bg = new Sprite({id: 'openIssue', key: 'BJL_open_bg', p, x: 642, y: 289, anchor: {x: 0.5, y: 0.5}, scale: {x: 0.5, y: 0.5}, alpha: 0.3})
            const key = this.getOpenIssueKey()
            const str = new Sprite({id: 'openIssue', key, p: bg, x: 3, y: -62, anchor: {x: 0.5, y: 0.5}})
            const onComplete = () => TweenMax.to(bg, 0.5, {pixi: {alpha: 0, scaleX: 0.8, scaleY: 0.8}, delay: 1, onComplete: () => p.destroy({children: true})})
            TweenMax.to(bg, 0.5, {pixi: {alpha: 1, scaleX: 1, scaleY: 1}, onComplete})
            this.setSoundOptionAndPlay('BJL_open', {volume: 0.5})
        },
        getOpenIssueKey() {
            const balls = this.lastballs
            const bookmakerPoint = this.calcBookmaker(balls) % 10
            const playerPoint = this.calcPlayer(balls) % 10
            const lang = this.lang === 'cn' ? this.lang : 'en'
            if (bookmakerPoint > playerPoint) {
                return `BJL_BK_W_${lang}`
            } else if (bookmakerPoint === playerPoint) {
                return `BJL_TIE_W_${lang}`
            } else {
                return `BJL_PY_W_${lang}`
            }
        }
    }
}
</script>