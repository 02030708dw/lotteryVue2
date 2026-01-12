<script>
import drag from '@C/pixi/drag'
import Container from '@C/pixi/components/Container'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Text from '@C/pixi/components/Text'

// import * as PIXI from 'pixi.js'

export default {
    name: 'drawHistory',
    beforeMount() {
        this.drawFnFlow.push(
            this.drawHistory
        )
        this.resourceArr.push(
            { id: 'history', file: 'history/sp.json' }
        )
    },
    methods: {
        drawHistory() {
            const container = new Container(this.container, {name: 'History'})
            // 開獎看版
            const p = new Sprite({ id: 'history', key: 'hPlace', x: 171.5, y: 6, p: container })
            // 龍虎
            const long = new Sprite({ id: 'history', key: 'hLong', x: 20, y: 23, p })
            const hu = new Sprite({ id: 'history', key: 'hHu', x: 250, y: 30, p })
            let style = { fontSize: 36, fill: '#fff6b9', stroke: '#714c28', strokeThickness: 5, fontWeight: 'bold' }
            const vs = new Text({ text: 'vs', style, x: 148, y: 27, p, anchor: {x: 0, y: 0} })

            // 獎期
            style = {
                fontFamily: 'Times New Roman',
                fontSize: 18,
                fill: '#fff',
                stroke: '#121206',
                strokeThickness: 3,
                fontWeight: 'bold'
            }
            this.openIssue = new Text({ text: this.$t('common_001', {'0': this.lastnumber}), style, x: 28.5, y: 4, p, anchor: {x: 0, y: 0} })
            // 開獎號碼球
            this.balls[0] = new Sprite({ id: 'history', key: 'hnLong', x: 92, y: 27, p })
            this.balls[1] = new Sprite({ id: 'history', key: 'hnHu', x: 198, y: 27, p })
            let key = `h${this.lastballs[0]}`
            this.balls[0].num = new Sprite({ id: 'history', key, x: 24.5, y: 26.5, p: this.balls[0], anchor: {x: 0.5, y: 0.5} })
            key = `h${this.lastballs[4]}`
            this.balls[1].num = new Sprite({ id: 'history', key, x: 24.5, y: 26.5, p: this.balls[1], anchor: {x: 0.5, y: 0.5} })

            // 展開按鈕
            const openBtn = new Button({ id: 'history', key: 'hSwitchBtn', x: 320, y: 49, p, anchor: {x: 0.5, y: 0.5}, rotation: Math.PI }, {
                up: { fn: () => {
                    let rotation
                    this.isShowHistory = !this.isShowHistory
                    if (this.isShowHistory) {
                        rotation = 0
                        container.zIndex = 100
                        this.drawHistoryTable()
                    } else {
                        rotation = Math.PI
                        this.historyTable.destroy({children: true})
                        this.historyTable = null
                        this.mask.hide(() => (container.zIndex = null))
                    }
                    TweenMax.to(openBtn, 0.3, { rotation })
                } }
            })
        },
        drawHistoryTable() {
            if (!this.isShowHistory) {
                return
            }
            if (!this.historyTable) {
                this.historyTable = new Container(this.container, {name: 'HistoryTable'})
                this.mask.show()
                this.historyTable.zIndex = 100
            } else {
                this.historyTable.table.destroy({children: true})
                this.historyTable.table = null
            }
            // 表格背景
            const p = this.historyTable.table = new Sprite({ id: 'history', key: 'hTable', x: 137, y: 92, p: this.historyTable })
            // 表格內部資料
            this.historyTable.issueData = this.historyBall.slice(0, 10).map(({code, issue}, i) => {
                const x = 95
                const y = 60 + (i * 45)
                let style = { fontSize: 22, fill: '#fff6b9', stroke: '#714c28', strokeThickness: 2 }
                // 獎期期數
                const issueText = new Text({ text: this.$t('common_001', {'0': issue}), style, x, y, p, anchor: {x: 0, y: 0} })
                // 獎期號碼及顏色
                const issueBalls = code.split(' ').map((ballNum, i2) => {
                    const x = 319 + (i2 * 42)
                    const y = 54 + (i * 45)
                    const scale = { x: 0.75, y: 0.75 }
                    let ball
                    if (i2 === 0) {
                        ball = new Sprite({ id: 'history', key: 'hnLong', x, y, scale, p })
                    } else if (i2 === 4) {
                        ball = new Sprite({ id: 'history', key: 'hnHu', x, y, scale, p })
                    } else {
                        ball = new Sprite({ id: 'history', key: 'hn', x, y, scale, p })
                    }
                    let key = `h${ballNum}`
                    const num = new Sprite({ id: 'history', key, x: 24.5, y: 26.5, p: ball, anchor: {x: 0.5, y: 0.5} })
                    return { ball, num }
                })
                return { issueText, issueBalls }
            })
        }
    }
}
</script>