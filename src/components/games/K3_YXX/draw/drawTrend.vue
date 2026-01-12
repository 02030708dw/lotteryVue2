<script>
import drag from '@C/pixi/drag'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Text from '@C/pixi/components/Text'
import Scrollbox from '@C/pixi/components/Scrollbox'
import Container from '@C/pixi/components/Container'
import Graphics from '@C/pixi/components/Graphics'
import ButtonMixin from '@C/pixi/components/ButtonMixin'
import AnimatedSprite from '@C/pixi/components/AnimatedSprite'

// import * as PIXI from 'pixi.js'

export default {
    name: 'drawTrend',
    data() {
        return {
            trendBalls: [],
            trendIndex: 0
        }
    },
    beforeMount() {
        this.drawFnFlow.push(
            this.drawTrend
        )
        this.resourceArr.push(
            { id: 'tPlace', file: 'trend/tPlace.png' },
            { id: 'trendTable', file: 'trend/trendTable.png' },
            { id: 'FishShrimpCrab', file: 'FishShrimpCrab/sp.json' }
        )
    },
    methods: {
        // 畫圖
        drawTrend() {
            const p = this.box = new Container(this.container, {name: 'Trend'})
            this.trendPlace = new Sprite({ id: 'tPlace', x: 15, y: 262, p })
            const trendBtn = new Button({ id: 'btn', key: 'trend', x: 52, y: 216, anchor: {x: 0.5, y: 0.5}, p }, {
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
                const issuePeriod = issue.split('-')[1]
                if (this.trendBalls.length) {
                    const { issue: issue2 } = this.trendBalls
                    //如果獎期一樣則不更新
                    if (issue === issue2) {
                        return
                    }
                    this.trendPlace.cacheAsBitmap = false
                    this.trendPlace.issueText.text = issuePeriod
                    this.trendBalls[0].destroy()
                    this.trendBalls[1].destroy()
                    this.trendBalls[2].destroy()
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
                    const x = 3
                    this.trendPlace.issueText = new Text({ text: issuePeriod, x: 35, y: 25, style, p })
                }
                this.trendBalls[0] = new AnimatedSprite({ id: this.drawIconGif(balls[0]), x: 20, y: 310, animationSpeed: 0.4, scale: {x: 0.75, y: 0.75}, p: this.box })
                this.trendBalls[0].x = 53 - (this.trendBalls[0].width / 2)
                this.trendBalls[1] = new AnimatedSprite({ id: this.drawIconGif(balls[1]), x: 20, y: 370, animationSpeed: 0.4, scale: {x: 0.75, y: 0.75}, p: this.box })
                this.trendBalls[1].x = 53 - (this.trendBalls[1].width / 2)
                this.trendBalls[2] = new AnimatedSprite({ id: this.drawIconGif(balls[2]), x: 20, y: 430, animationSpeed: 0.4, scale: {x: 0.75, y: 0.75}, p: this.box })
                this.trendBalls[2].x = 53 - (this.trendBalls[2].width / 2)
                this.trendBalls[0].play()
                this.trendBalls[1].play()
                this.trendBalls[2].play()
                this.trendBalls.issue = issue
                this.trendPlace.cacheAsBitmap = true
            }
        },
        drawIconGif(num) {
            const iconGif = {
                'fish': 'fishcomp',
                'gourd': 'hoocomp',
                'chicken': 'chickencomp',
                'crab': 'crabcomp',
                'tiger': 'tigercomp',
                'shrimp': 'shrimpcomp'
            }
            return iconGif[num]
        },
        drawTrendTable() {
            this.trendTable = new Container(this.front, {name: 'TrendTable'})
            const trendTable = new Sprite({ id: 'trendTable', x: 97, y: 105, p: this.trendTable })
            trendTable.setStop()
            const p = trendTable
            this.drawGameScore()
        },
        drawGameScore(isUpdate) {
            if (!this.trendTable) {
                return
            }
            const arr = this.gameHistoryList
            const length = arr.length < 50 ? arr.length : 50
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
                    .drawRoundedRect(0, 30, width, 300, 10) //畫一個紅色方塊
                    .endFill()
                ;[...Array(length - 1)].forEach((v, i) => {
                    const x = (i + 1) * 90
                    grid
                        .moveTo(x, 30)
                        .lineTo(x, 330)
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
                arr.forEach(({code, issue}, i) => {
                    if (i < 50) {
                        const x = i * 90
                        const balls = this.getHistoryKey(code)
                        const issuePeriod = issue.split('-')[1]
                        issueText = new Text({ text: issuePeriod, x: x + 45, y: 10, style, p: grid })
                        ball[0] = new Sprite({ id: 'FishShrimpCrab', key: balls[0], x, y: 55, p: grid })
                        ball[1] = new Sprite({ id: 'FishShrimpCrab', key: balls[1], x, y: 140, p: grid })
                        ball[2] = new Sprite({ id: 'FishShrimpCrab', key: balls[2], x, y: 225, p: grid })
                    }
                })
                grid.x = grid.y = 1
                scrollBox.update()
                const TweenMaxDom = [
                    issueText,
                    ball[0],
                    ball[1],
                    ball[2]
                ]
                if (isUpdate) {
                    TweenMax.to(TweenMaxDom, 0.5, {alpha: 0.3, repeat: 7, yoyo: true, onComplete: () => (this.trendTable.row.cacheAsBitmap = true)})
                } else {
                    this.trendTable.row.cacheAsBitmap = true
                }
                //this.trendTable.row.cacheAsBitmap = true
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
                    boxWidth: 1000,
                    boxHeight: 345,
                    scrollbarBackgroundAlpha: 0,
                    scrollbarForeground: 0x000000,
                    scrollbarForegroundAlpha: 0.2
                })
                scrollbox.x = 60
                scrollbox.y = 130
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
            const fscArr = []
            code.forEach((x) => {
                // console.log(x)
                switch (+x[0]) {
                    case 1: x = 'fish'
                        break
                    case 2: x = 'shrimp'
                        break
                    case 3: x = 'gourd'
                        break
                    case 4: x = 'tiger'
                        break
                    case 5: x = 'crab'
                        break
                    case 6: x = 'chicken'
                        break
                }
                fscArr.push(x)
            })
            return fscArr
        }

    }
}
</script>