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
// import drawHistory from './draw/drawHistory'
import drawTrend from './draw/drawTrend'
import drawMenu from '@C/games/components/Table/draw/drawMenu'
import drawButton from './draw/drawButton'
import drawGameSubmitPop from '@C/games/components/Table/draw/drawGameSubmitPop'
import drawPop from '@C/games/components/Table/draw/drawPop'
import drawPlayInfo from '@C/games/components/Table/draw/drawPlayInfo'
import drawBetSuccess from '@C/games/components/Table/draw/drawBetSuccess'
import drawCalculator from './draw/drawCalculator'

// import * as PIXI from 'pixi.js'

export default {
    name: 'K3_SB',
    mixins: [
        GameTable,
        draw,
        drawMethod,
        drawCoin,
        drawMenu,
        // drawHistory,
        drawTrend,
        drawButton,
        drawGameSubmitPop,
        drawPop,
        drawPlayInfo,
        drawBetSuccess,
        drawPreLoad,
        drawCalculator
    ],
    data() {
        return {
            gameType: 'K3_SB',
            gameStyle: {
                overflow: 'hidden',
                position: 'fixed',
                height: '100vh',
                textAlign: 'center',
                background: '#000'
            },
            urlPath: `${CDN}/static/pixi/SB/`,
            soundPath: `${CDN}/static/sound/`
        }
    },

    methods: {

    },
    watch: {
        historyBall() {
            if (PIXI.isPlayIng) {
                this.drawTrendBalls()
                this.drawGameScore(true)
            }
        },
        isShowOrderFutureButton(open) {
            // 更新連投區域
            this.changeMutiArea(open)
        }
    }
}
</script>