<script>
import drag from '@C/pixi/drag'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Graphics from '@C/pixi/components/Graphics'
import TrendBtn from '../components/TrendBtn'
import Text from '@C/pixi/components/Text'
import Scrollbox from '@C/pixi/components/Scrollbox'
import Container from '@C/pixi/components/Container'

// import * as PIXI from 'pixi.js'

export default {
    name: 'drawTrend',
    data() {
        return {
            trendBalls: [],
            trendIndex: 0,
            trendBallsOffset: [
                {x: 4, y: 4},
                {x: 6, y: 4},
                {x: 6, y: 5},
                {x: 6, y: 5},
                {x: 6, y: 5},
                {x: 6, y: 5}
            ]
        }
    },
    beforeMount() {
        this.drawFnFlow.push(
            this.drawTrend
        )
        this.resourceArr.push(
            { id: 'trend', file: 'trend/sp.json' }
        )
    },
    methods: {
        // 畫圖
        drawTrend() {
            const p = new Container(this.container, {name: 'Trend'})
            this.trendPlace = new Sprite({ id: 'trend', key: 'tlPlace', x: 62.5, y: 158, p })
            const trendBtn = new Button({ id: 'btn', key: 'BJL_Button', x: 100, y: 196, scale: {x: 0.73, y: 0.73}, anchor: {x: 0.5, y: 0.5}, p }, {
                down: { textureID: 'BJL_Button_c' },
                up: {
                    fn: () => {
                        // 開啟/關閉音效
                        const fn = () => {
                            this.trendTable.destroy({children: true})
                            this.trendTable = null
                        }
                        this.setSoundOptionAndPlay('ui002_openui', {volume: 0.5})
                        if (this.trendTable) {
                            this.mask.hide(p)
                        } else {
                            this.drawTrendTable()
                            this.mask.show(p, fn)
                        }
                    },
                    textureID: 'BJL_Button' },
                out: { textureID: 'BJL_Button' }
            })
            const symbol = new Sprite({ id: 'btn', key: 'BJL_TrendLine', x: 81, y: 183, p })

            this.drawTrendBalls()
        },
        drawTrendBalls() {
            const p = this.trendPlace
            if (p) {
                const balls = this.historyBall.slice(0, 6)
                const reset = () => {
                    this.trendBalls.forEach(ball => {
                        ball.tween && ball.tween.kill()
                        ball.destroy({children: true})
                    })
                    this.trendBalls = []
                    this.drawTrendBalls()
                }
                const anchor = {x: 0.5, y: 0.5}
                const offset = 52
                const time = 0.5
                // 如果有資料則進行動畫處理
                if (this.trendBalls.length) {
                    const { code, issue } = balls[0]
                    const { issue: issue2 } = this.trendBalls[0]
                    //如果獎期一樣則不更新
                    if (issue === issue2) {
                        return
                    }
                    const key = this.calcData(code)
                    const ball = new Sprite({ id: 'trend', key, x: 35, y: 49, anchor, p, issue, code })
                    this.trendBalls = [ball, ...this.trendBalls]
                    let isReset
                    balls.forEach(({code}) => {
                        if (!this.trendBalls.find((ball) => ball.code === code)) {
                            isReset = true
                        }
                    })
                    if (this.trendBalls.length > 7 || isReset) {
                        return reset()
                    }
                    this.trendBalls.forEach((ball, i) => {
                        const y = ball.y + offset
                        if (i === 6) {
                            this.trendBalls[i].tween = TweenMax
                                .to(ball, time, { y, alpha: 0 })
                                .eventCallback('onComplete', () => {
                                    ball.destroy({children: true})
                                    this.trendBalls.pop()
                                })
                            return
                        }
                        this.trendBalls[i].tween = TweenMax.to(ball, time, { y })
                    })
                } else {
                    balls.forEach(({code, issue}, i) => {
                        const key = this.calcData(code)
                        const x = 35
                        const y = 100 + (i * offset)
                        this.trendBalls[i] = new Sprite({ id: 'trend', key, x, y, anchor, p, issue, code })
                    })
                }
            }
        },
        drawTrendTable() {
            this.trendIndex = 0
            this.trendTable = new Container(this.front, {name: 'TrendTable'})
            const trendTable = new Sprite({ id: 'trend', key: 'tPlace', x: 142, y: 158, p: this.trendTable })
            const btnContainer = new Container(this.trendTable, { x: 127, y: 105 })
            const scrollBox = new Scrollbox({
                boxWidth: 1020,
                boxHeight: 80,
                scrollbarSize: 0,
                stopPropagation: false,
                dragScroll: false
            })
            scrollBox.x = 45
            const viewport = scrollBox.content
            btnContainer.addChild(scrollBox)
            trendTable.setStop()
            const p = trendTable
            let style = {
                fill: '#ffffff',
                fontSize: 22,
                fontFamily: 'Microsoft Yahei'
            }
            if (this.lang !== 'cn') {
                const tpY = 355
                const numY = 364
                const y = 397
                const scale = { x: 0.8, y: 0.8 }
                const style = {
                    fill: '#ffffff',
                    fontSize: 14,
                    fontFamily: 'Microsoft Yahei'
                }
                const numStyle = {...style, fontSize: 18}
                const tp1 = new Sprite({ id: 'trend', key: 'tp1', x: 357, y: tpY, p, scale })
                this.trendTable.num1 = new Text({ text: '', x: 406, y: numY, p, anchor: {x: 0, y: 0}, style: numStyle })
                const banker = new Text({ text: this.$t('pk10_t_135'), x: 378, y, p, anchor: {x: 0.5, y: 0}, style: {...style, fill: '#ffabab'} })
                const tp2 = new Sprite({ id: 'trend', key: 'tp2', x: 477, y: tpY, p, scale })
                this.trendTable.num2 = new Text({ text: '', x: 527, y: numY, p, anchor: {x: 0, y: 0}, style: numStyle })
                const player = new Text({ text: this.$t('baccarat_001'), x: 498, y, p, anchor: {x: 0.5, y: 0}, style: {...style, fill: '#a4dfff'} })
                const tp3 = new Sprite({ id: 'trend', key: 'tp3', x: 598, y: tpY, p, scale })
                this.trendTable.num3 = new Text({ text: '', x: 652, y: numY, p, anchor: {x: 0, y: 0}, style: numStyle })
                const sum = new Text({ text: this.$t('trend_pk10_t_017'), x: 618, y, p, anchor: {x: 0.5, y: 0}, style: {...style, fill: '#b3ffb3'} })
            } else {
                const tpY = 357
                const numY = 366
                const tp1 = new Sprite({ id: 'trend', key: 'tp1', x: 357, y: tpY, p })
                this.trendTable.num1 = new Text({ text: '', x: 413, y: numY, p, anchor: {x: 0, y: 0}, style })
                const tp2 = new Sprite({ id: 'trend', key: 'tp2', x: 477, y: tpY, p })
                this.trendTable.num2 = new Text({ text: '', x: 534, y: numY, p, anchor: {x: 0, y: 0}, style })
                const tp3 = new Sprite({ id: 'trend', key: 'tp3', x: 598, y: tpY, p })
                this.trendTable.num3 = new Text({ text: '', x: 659, y: numY, p, anchor: {x: 0, y: 0}, style })
            }
            // this.trendTable.issueText = new Text({ text: this.$t('common_001', {'0': 1}), style, x: 777, y: 366, p, anchor: {x: 0, y: 0} })

            if (viewport.width > 1020) {
                viewport
                    .drag({ direction: 'x', factor: 0 })
                    .decelerate({minSpeed: 10})
                    .on('moved-end', () => {
                        const {x, width} = viewport
                        if (width < 1020 - x) {
                            viewport.snap(width - 1020, 0, {topLeft: true, removeOnComplete: true, time: 300})
                        } else if (x > 0) {
                            viewport.snap(0, 0, {topLeft: true, removeOnComplete: true, time: 300})
                        }
                    })
            }
            scrollBox.update()
            this.drawGameScore()
        },
        drawGameScore(isUpdate) {
            if (!this.trendTable) {
                return
            }
            const arr = this.calcGameScore(this.calcData)
            const length = Math.max(arr.length, 19)
            const width = length * 52.5
            const issue = this.gameHistoryList[this.gameHistoryList.length - 1].issue
            let grid = this.trendTable.grid
            let time = 1

            const draw = () => {
                grid = this.trendTable.grid = new Graphics(this.trendTable.row)
                grid.lastIssue = issue
                const trendCount = {}
                const scrollBox = this.trendTable.scrollbox
                const viewport = scrollBox.content
                this.trendTable.row.cacheAsBitmap = false

                grid
                    .lineStyle(1, 0x1cbbc7)
                    .drawRoundedRect(0, 0, width, 320, 1) //畫一個紅色方塊
                    .endFill()
                ;[...Array(5)].forEach((v, i) => {
                    const y = (i + 1) * 53
                    grid
                        .moveTo(0, y)
                        .lineTo(width, y)
                })
                ;[...Array(length - 1)].forEach((v, i) => {
                    const x = (i + 1) * 52.5
                    grid
                        .moveTo(x, 0)
                        .lineTo(x, 320)
                })
                let ball = []
                const {x: offsetX, y: offsetY} = this.trendBallsOffset[this.trendIndex]
                arr.forEach((dataArr, i) => {
                    const x = i * 52.5 + offsetX
                    dataArr.forEach((data, j) => {
                        const { key, index } = data
                        const y = j * 53 + offsetY
                        const scale = { x: 0.9, y: 0.9 }
                        ball[index] = new Sprite({ id: 'trend', key, x, y, scale, p: grid })
                        trendCount[key] = (trendCount[key] || 0) + 1
                    })
                })
                grid.x = grid.y = 1
                scrollBox.update()
                if (isUpdate) {
                    const lastBall = ball[ball.length - 1]
                    TweenMax.to(lastBall, 0.5, {
                        alpha: 0.3,
                        repeat: 7,
                        yoyo: true,
                        onComplete: () => {
                            lastBall.alpha = 1
                            this.trendTable.row.cacheAsBitmap = true
                        }
                    })
                } else {
                    this.trendTable.row.cacheAsBitmap = true
                }
                this.trendTable.num1.text = trendCount.tp1 || 0
                this.trendTable.num2.text = trendCount.tp2 || 0
                this.trendTable.num3.text = trendCount.tp3 || 0
                viewport.snap(width - 1020 + 2, 0, {topLeft: true, removeOnComplete: true, time})
            }
            if (grid) {
                //如果獎期一樣則不更新
                if (issue === grid.lastIssue) {
                    return
                }
                if (isUpdate) {
                    time = 500
                }
                grid.destroy({children: true})
                draw()
            } else {
                const scrollbox = this.trendTable.scrollbox = new Scrollbox({
                    boxWidth: 1020,
                    boxHeight: 322,
                    scrollbarBackgroundAlpha: 0,
                    scrollbarForeground: 0x000000,
                    scrollbarForegroundAlpha: 0.2
                })
                scrollbox.x = 6
                scrollbox.y = 26
                this.trendTable.row = new Graphics(scrollbox.content, {width: 1102})
                this.trendTable.children[0].addChild(scrollbox)
                draw()
            }
        },
        // 庄家
        calcBookmaker(code) {
            const first = (+code[4] + +code[5]) % 10
            const second = (+code[6] + +code[7]) % 10
            const third = +code[9]
            const sum = (first + second) % 10
            // 闲家 前兩張牌
            const pyfirst = (+code[0] + +code[1]) % 10
            const pysecond = (+code[2] + +code[3]) % 10
            const pythird = this.calcPlayer2(code)
            const pysum = (pyfirst + pysecond) % 10
            // 闲家首兩張牌合計點數为8-9点。
            // 庄家首兩張牌合計點數为7-9点。
            if (pysum > 7 || sum > 6) {
                return sum
            // 若闲家为6、7点时，庄家补牌。
            // 若闲家为1、2、3点时补一张牌，除非闲家为8或9点。
            } else if ([6, 7].includes(pysum) || [0, 1, 2].includes(sum)) {
                return sum + third
            } else {
                switch (sum) {
                    // 若闲家补得第三张牌为8点，庄家不须补。
                    // 若闲家补得第三张牌非8点，庄家补牌。
                    case 3:
                        return pythird !== 8 ? sum + third : sum
                    case 4:
                        return [2, 3, 4, 5, 6, 7].includes(pythird) ? sum + third : sum
                    case 5:
                        return [4, 5, 6, 7].includes(pythird) ? sum + third : sum
                    case 6:
                        return [6, 7].includes(pythird) ? sum + third : sum
                    default:
                        return sum
                }
            }
        },
        // 闲家
        calcPlayer(code) {
            const first = (+code[0] + +code[1]) % 10
            const second = (+code[2] + +code[3]) % 10
            const third = +code[8]
            const sum = (first + second) % 10
            // 庄家 前兩張牌
            const bkfirst = (+code[4] + +code[5]) % 10
            const bksecond = (+code[6] + +code[7]) % 10
            const bksum = (bkfirst + bksecond) % 10
            return (bksum > 7 || sum > 5) ? sum : sum + third
        },
        // 闲家補牌
        calcPlayer2(code) {
            const first = (+code[0] + +code[1]) % 10
            const second = (+code[2] + +code[3]) % 10
            const third = +code[8]
            const sum = (first + second) % 10
            // 庄家 前兩張牌
            const bkfirst = (+code[4] + +code[5]) % 10
            const bksecond = (+code[6] + +code[7]) % 10
            const bksum = (bkfirst + bksecond) % 10
            return (bksum > 7 || sum > 5) ? 0 : third
        },
        // 計算部分
        calcData(code) {
            code = code.split(',')
            const bookmakerPoint = this.calcBookmaker(code) % 10
            const playerPoint = this.calcPlayer(code) % 10
            if (bookmakerPoint > playerPoint) {
                return 'tp1'
            } else if (bookmakerPoint === playerPoint) {
                return 'tp3'
            } else {
                return 'tp2'
            }
        },
        // 遞迴計算路紙Y座標，Y最大為5
        handMaxY(pos, x) {
            if (pos[x]) {
                // 遞迴計算
                const fn = (y) => {
                    if (pos[x][y]) {
                        return y - 1
                    }
                    return fn(y + 1)
                }
                return fn(0)
            }
            return 5
        },
        // L型路紙邏輯包裝
        calcGameScore(logicFn) {
            let x = 0
            let y = 0
            let pos = []
            let prev
            let diff = 0
            let maxY = 5
            this.gameHistoryList.forEach(({issue, code}, i) => {
                const key = logicFn(code)
                if (i) {
                    if (prev === key) {
                        if (y === maxY) {
                            x++
                            if (maxY === 0) {
                                diff++
                            }
                        } else {
                            y++
                        }
                    } else {
                        y = 0
                        x = ++diff
                        maxY = this.handMaxY(pos, x)
                    }
                }
                prev = key
                if (!pos[x]) {
                    pos[x] = []
                }
                pos[x][y] = {
                    index: i,
                    issue,
                    key
                }
            })
            return pos
        }
    }
}
</script>