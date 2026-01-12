<script>
import drag from '@C/pixi/drag'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Text from '@C/pixi/components/Text'
import Scrollbox from '@C/pixi/components/Scrollbox'
import Container from '@C/pixi/components/Container'
import Graphics from '@C/pixi/components/Graphics'
import ButtonMixin from '@C/pixi/components/ButtonMixin'

// import * as PIXI from 'pixi.js'

export default {
    name: 'drawTrend',
    data() {
        return {
            trendBalls: [],
            trendIndex: 0,
            langBall: [
                { key: 'tBig', text: this.$t('4d_t_055') },
                { key: 'tSmall', text: this.$t('4d_t_056') },
                { key: 'tOdd', text: this.$t('4d_t_058') },
                { key: 'tEven', text: this.$t('4d_t_057') }
            ]
        }
    },
    beforeMount() {
        this.drawFnFlow.push(
            this.drawTrend
        )
        this.resourceArr.push(
            { id: 'trend', file: 'trend/sp.json' },
            { id: 'trendTable', file: 'trend/trendTable.png' }
        )
    },
    methods: {
        // 畫圖
        drawTrend() {
            const p = new Container(this.container, {name: 'Trend'})
            this.trendPlace = new Sprite({ id: 'trend', key: 'tPlace', x: 21, y: 151, p })
            const trendBtn = new Button({ id: 'btn', key: 'trend', x: 59, y: 188, anchor: {x: 0.5, y: 0.5}, p }, {
                down: { textureID: 'trendc' },
                up: {
                    fn: () => {
                        this.setSoundOptionAndPlay('ui002_openui', {volume: 0.5})
                        const fn = () => {
                            this.trendTable.destroy({children: true})
                            this.trendTable = null
                        }
                        if (this.trendTable) {
                            this.mask.hide(p)
                        } else {
                            this.drawTrendTable()
                            this.mask.show(p, fn)
                        }
                    },
                    textureID: 'trend' },
                out: { textureID: 'trend' }
            })
            // drag(trendBtn)
            this.drawTrendBalls()
        },
        drawTrendBalls() {
            const p = this.trendPlace
            if (p) {
                const { code, issue } = this.historyBall[0]
                const balls = this.getHistoryKey(code)
                const issuePeriod = issue.indexOf('-') > 0 ? issue.split('-')[1] : issue
                if (this.trendBalls.length) {
                    const { issue: issue2 } = this.trendBalls
                    //如果獎期一樣則不更新
                    if (issue === issue2) {
                        return
                    }
                    this.trendPlace.cacheAsBitmap = false
                    this.trendPlace.issueText.text = issuePeriod
                    this.trendBalls[0].setTextureKey(balls[0])
                    this.trendBalls[1].setTextureKey(balls[1])
                    this.trendBalls[2].setTextureKey(balls[2])
                    this.trendBalls[3].setTextureKey(balls[3])
                    this.trendBalls[4].setTextureKey(balls[4])
                    this.trendPlace.totalBall.text = balls[5]
                } else {
                    this.trendBalls = []
                    const style = {
                        fill: '#ffffff',
                        fontSize: 18,
                        stroke: '#03498f',
                        strokeThickness: 3,
                        fontFamily: 'Microsoft JhengHei'
                    }
                    const style2 = {
                        fill: '#ffffff',
                        fontSize: 22,
                        stroke: '#004723',
                        strokeThickness: 3,
                        fontFamily: 'Microsoft JhengHei'
                    }
                    const x = 17
                    const ballWH = 48
                    const diceWH = 44
                    this.trendPlace.issueText = new Text({ text: issuePeriod, x: x + 23, y: 88, style, p })
                    this.trendBalls[0] = new Sprite({ id: 'trend', key: balls[0], x, y: 100, width: ballWH, height: ballWH, p })
                    this.trendBalls[1] = new Sprite({ id: 'trend', key: balls[1], x, y: 150, width: ballWH, height: ballWH, p })
                    this.trendBalls[2] = new Sprite({ id: 'trend', key: balls[2], x, y: 200, width: ballWH, height: ballWH, p })
                    this.trendBalls[3] = new Sprite({ id: 'trend', key: balls[3], x, y: 250, width: diceWH, height: diceWH + 3, p })
                    this.trendBalls[4] = new Sprite({ id: 'trend', key: balls[4], x, y: 295, width: diceWH, height: diceWH + 3, p })
                    this.trendBalls[5] = new Sprite({ id: 'trend', key: 'tBallBg', x, y: 340, width: diceWH, height: diceWH + 3, p })
                    this.trendPlace.totalBall = new Text({ text: balls[5], x: 23.5, y: 23.5, style: style2, p: this.trendBalls[5] })
                }
                this.trendBalls.issue = issue
                this.trendPlace.cacheAsBitmap = true
            }
        },
        drawTrendTable() {
            this.trendTable = new Container(this.front, {name: 'TrendTable'})
            const trendTable = new Sprite({ id: 'trendTable', x: 97, y: 105, p: this.trendTable })
            trendTable.setStop()
            const p = trendTable
            // const closeBtn = new Button(
            //     { id: 'trend', key: 'tClose', x: 1006, y: 39, p },
            //     {
            //         up: {
            //             fn: () => {
            //                 this.trendTable.destroy({children: true})
            //                 this.trendTable = null
            //                 this.mask.hide(this.trendPlace.parent)
            //             }
            //         }
            //     }
            // )
            if (this.lang !== 'cn') {
                // 多語球
                let style = {
                    fill: '#ffffff',
                    fontSize: 20,
                    fontFamily: 'Microsoft Yahei'
                }
                const langBallSize = 40 // 球寬高
                const langBallSpac = 150 // 間距
                let langBallArr = []
                let langTextArr = []
                let langBall, langText
                this.langBall.map((val, i) => {
                    langBallArr.push(langBall = new Sprite({ id: 'trend', key: val.key, width: langBallSize, height: langBallSize + 3, x: 287 + langBallSpac * i, y: 395, style, p, visible: this.lang !== 'cn' }))
                    langTextArr.push(langText = new Text({ text: val.text, x: 330 + langBallSpac * i, y: 415, anchor: {x: 0, y: 0.5}, p, style, visible: this.lang !== 'cn' }))
                })
            }
            this.drawGameScore()
        },
        drawGameScore(isUpdate) {
            if (!this.trendTable) {
                return
            }
            const arr = this.gameHistoryList
            const length = arr.length
            const width = length * 90
            const issue = arr[length - 1].issue
            let grid = this.trendTable.grid
            let time = 1

            const draw = () => {
                grid = this.trendTable.grid = new Graphics(this.trendTable.row)
                grid.lastIssue = issue
                const scrollBox = this.trendTable.scrollbox
                const viewPort = scrollBox.content
                this.trendTable.row.cacheAsBitmap = false

                grid
                    .lineStyle(1, 0xffffff)
                    .drawRoundedRect(0, 20, width, this.lang === 'cn' ? 355 : 310, 10) //畫一個紅色方塊
                    .endFill()
                const y = this.lang === 'cn' ? 215 : 175
                grid
                    .moveTo(0, y)
                    .lineTo(width, y)
                ;[...Array(length - 1)].forEach((v, i) => {
                    const x = (i + 1) * 90
                    grid
                        .moveTo(x, 20)
                        .lineTo(x, this.lang === 'cn' ? 375 : 330)
                })
                let ball = []
                let count = 0
                let issueText = ''
                const style = {
                    fill: '#ffffff',
                    fontSize: 18,
                    stroke: '#03498f',
                    strokeThickness: 3,
                    fontFamily: 'Microsoft JhengHei'
                }
                const style2 = {
                    fill: '#ffffff',
                    fontSize: 22,
                    stroke: '#004723',
                    strokeThickness: 3,
                    fontFamily: 'Microsoft JhengHei'
                }
                if (this.lang === 'cn') {
                    arr.forEach(({code, issue}, i) => {
                        const x = i * 90 + 18
                        const balls = this.getHistoryKey(code)
                        const issuePeriod = issue.indexOf('-') > 0 ? issue.split('-')[1] : issue
                        const issueText = new Text({ text: issuePeriod, x: x + 28, y: 8, style, p: grid })
                        ball[0] = new Sprite({ id: 'trend', key: balls[0], x, y: 30, p: grid })
                        ball[1] = new Sprite({ id: 'trend', key: balls[1], x, y: 90, p: grid })
                        ball[2] = new Sprite({ id: 'trend', key: balls[2], x, y: 150, p: grid })
                        ball[3] = new Sprite({ id: 'trend', key: balls[3], x: x + 3, y: 220, p: grid })
                        ball[4] = new Sprite({ id: 'trend', key: balls[4], x: x + 3, y: 270, p: grid })
                        ball[5] = new Sprite({ id: 'trend', key: 'tBallBg', x: x + 3, y: 320, p: grid })
                        const totalBall = new Text({ text: balls[5], x: 23.5, y: 23.5, style: style2, p: ball[5] })
                    })
                } else {
                    arr.forEach(({code, issue}, i) => {
                        const diceSize = 45
                        const x = i * 90 + 23
                        const spac = 47
                        const balls = this.getHistoryKey(code)
                        const issuePeriod = issue.indexOf('-') > 0 ? issue.split('-')[1] : issue
                        issueText = new Text({ text: issuePeriod, x: x + 24, y: 8, style, p: grid })
                        ball[0] = new Sprite({ id: 'trend', key: balls[0], x, y: 28, width: diceSize, height: diceSize, p: grid })
                        ball[1] = new Sprite({ id: 'trend', key: balls[1], x, y: 28 + spac, width: diceSize, height: diceSize, p: grid })
                        ball[2] = new Sprite({ id: 'trend', key: balls[2], x, y: 28 + spac * 2, width: diceSize, height: diceSize, p: grid })
                        ball[3] = new Sprite({ id: 'trend', key: balls[3], x, y: 183, width: diceSize, height: diceSize + 2, p: grid })
                        ball[4] = new Sprite({ id: 'trend', key: balls[4], x, y: 183 + spac, width: diceSize, height: diceSize + 2, p: grid })
                        ball[5] = new Sprite({ id: 'trend', key: 'tBallBg', x, y: 183 + spac * 2, width: diceSize, height: diceSize + 2, p: grid })
                        const totalBall = new Text({ text: balls[5], x: 23.5, y: 23.5, style: style2, p: ball[5] })
                    })
                }
                grid.x = grid.y = 1
                scrollBox.update()
                const TweenMaxDom = [
                    issueText,
                    ball[0],
                    ball[1],
                    ball[2],
                    ball[3],
                    ball[4],
                    ball[5]
                ]
                if (isUpdate) {
                    TweenMax.to(TweenMaxDom, 0.5, {
                        alpha: 0.3,
                        repeat: 7,
                        yoyo: true,
                        onComplete: () => {
                            TweenMaxDom.alpha = 1
                            this.trendTable.row.cacheAsBitmap = true
                        }
                    })
                } else {
                    this.trendTable.row.cacheAsBitmap = true
                }
                //this.trendTable.row.cacheAsBitmap = true
                // const mask = new Sprite({ texture: PIXI.Texture.WHITE, width: this.trendTable.row.width, height: this.trendTable.row.height, p: this.trendTable.row })
                viewPort.snap(width - 920 + 2, 0, {topLeft: true, removeOnComplete: true, time})
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
            } else {
                const scrollbox = this.trendTable.scrollbox = new Scrollbox({
                    boxWidth: 920,
                    boxHeight: this.lang === 'cn' ? 390 : 340,
                    scrollbarBackgroundAlpha: 0,
                    scrollbarForeground: 0x000000,
                    scrollbarForegroundAlpha: 0.2
                })
                scrollbox.x = 80
                scrollbox.y = 50
                this.trendTable.row = new Container(scrollbox.content, {width: 1002})
                // this.trendTable.row = new ButtonMixin(scrollbox.content, {width: 1002}, {
                //     up: {
                //         fn: ({data}) => {
                //             const {x} = data.getLocalPosition(this.trendTable.row.parent)
                //             const index = ~~(x / 90)
                //             console.log(index)
                //         }
                //     }
                // })
                this.trendTable.children[0].addChild(scrollbox)
            }
            draw()
        },
        getHistoryKey(code) {
            code = code.split(' ')
            const diceArr = code.map(x => 'dice' + x)
            const total = +code[0] + +code[1] + +code[2]
            const BSBall = total <= 9 ? 'tSmall' : 'tBig'
            const OEBall = total % 2 === 0 ? 'tEven' : 'tOdd'
            diceArr.push(BSBall, OEBall, total)
            return diceArr
        }
    }
}
</script>