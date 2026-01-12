<template>
    <div>
        <div :style="gameStyle" ref="gameContainer" />
    </div>
</template>
<script>
import GameTable from '@C/games/GameTable'
import drawPreLoad from '@C/games/components/Table/draw/drawPreLoad'
import draw from './draw'
import drawMethod from './draw/drawMethod'
import drawCoin from './draw/drawCoin'
import drawTrend from './draw/drawTrend'
import drawCard from './draw/drawCard'
import drawMenu from './draw/drawMenu'
import drawButton from './draw/drawButton'
import drawOpenIssue from './draw/drawOpenIssue'
import drawPlayInfo from './draw/drawPlayInfo'
import drawPop from '@C/games/components/Table/draw/drawPop'
import drawGameSubmitPop from '@C/games/components/Table/draw/drawGameSubmitPop'
import drawBetSuccess from '@C/games/components/Table/draw/drawBetSuccess'
// import drawVideo from '@C/games/components/Table/draw/drawVideo'
// import drawVideoFrame from './draw/drawVideoFrame'
// import drawCalculator from './draw/drawCalculator'

// import * as PIXI from 'pixi.js'

export default {
    name: 'PK10_BJL',
    mixins: [
        GameTable,
        draw,
        drawMethod,
        drawCoin,
        drawMenu,
        drawTrend,
        drawCard,
        drawButton,
        drawPop,
        drawGameSubmitPop,
        drawBetSuccess,
        drawPlayInfo,
        drawPreLoad,
        drawOpenIssue
        // drawVideoFrame,
        // drawCalculator
    ],
    data() {
        return {
            gameType: 'PK10_BJL',
            gameStyle: {
                overflow: 'hidden',
                position: 'fixed',
                height: '100vh',
                textAlign: 'center',
                background: '#000'
            },
            urlPath: `${CDN}/static/pixi/BJL/`,
            soundPath: `${CDN}/static/sound/`,
            isShowVideo: false
        }
    },
    methods: {

    },
    computed: {
        // ...mapGetters([
        //     'game'
        // ])
        // 龍
    },
    watch: {
        lastballs() {
            if (this.balls[0]) {
                let key = `h${this.lastballs[0]}`
                this.balls[0].num.setTextureKey(key)
                key = `h${this.lastballs[4]}`
                this.balls[1].num.setTextureKey(key)
            }
        },
        historyBall() {
            if (PIXI.isPlayIng) {
                this.drawCards()
            }
        },
        isShowOrderFutureButton(open) {
            // 更新連投區域
            this.changeMutiArea(open)
        }
    }
}
</script>