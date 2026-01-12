<script>
import drag from '@C/pixi/drag'
import Container from '@C/pixi/components/Container'
import Scrollbox from '@C/pixi/components/Scrollbox'
import Graphics from '@C/pixi/components/Graphics'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import ButtonMixin from '@C/pixi/components/ButtonMixin'
import MutiText from '@C/pixi/components/MutiText'
import Text from '@C/pixi/components/Text'

import { formatNumber } from '@UTIL'

export default {
    name: 'drawGameSubmitPop',
    data() {
        return {
            // 是否 勾選中獎即停
            isTrace: true,
            // 是否 disable中獎即停
            isTraceDisabled: false
        }
    },
    beforeMount() {
        // this.drawFnFlow.push(
        //     this.drawGameSubmitPop
        // )
        this.resourceArr.push(
            { id: 'gameSubmitPop', file: 'sp.json', urlPath: `${CDN}/static/pixi/share/gameSubmitPop/` }
        )
    },
    methods: {
        drawGameSubmitPop() {
            this.mask.show()
            this.gameSubmitPop = new Container(this.front, { name: 'gameSubmitPop' })
            this.gameSubmitPop.draw = (isFrames = true) => {
            //背景圖
                const p = new Sprite({
                    id: 'gameSubmitPop',
                    key: this.orderFuture ? 'gameSubmitPop' : 'gameSubmitOfPop',
                    x: 240,
                    y: this.orderFuture ? 7 : 30,
                    p: this.gameSubmitPop,
                    // anchor: { x: 0, y: 0.5 },
                    scale: { x: 0.9, y: 0.9 }
                })
                //標題
                const titleStyle = {
                    fontFamily: 'Microsoft Yahei',
                    fontSize: 32,
                    fontWeight: 'bold',
                    fill: '#ffffff'
                // fill: ['#eed883', '#fff', '#e1c073', '#fdfce9', '#f0db89'],
                // stroke: '#752118',
                // strokeThickness: 3,
                // dropShadow: true,
                // dropShadowColor: '#752118',
                // dropShadowBlur: 1,
                // dropShadowAngle: Math.PI / 2,
                // dropShadowDistance: 4
                }
                let style = {
                    fontFamily: 'Microsoft Yahei',
                    fontSize: 36,
                    fill: '#fff',
                    fontWeight: 'bold'
                }
                const title = new Text({ text: this.$t('Glory_1022'), style: titleStyle, x: 376, y: 40, p, anchor: {x: 0.5, y: 0} })

                //資訊
                this.drawGameSubmitInfo(p)
                // 表格標頭
                this.drawGameSubmitTitle(p)
                // 投注內容scroll
                this.drawGameSubmitContent(p)
                this.drawTrace(p)
                this.drawGameSubmitBtn(p)
                // p.x = (this.container.width / 2) - 50
                // p.y = (this.container.height / 2) - 70
                // p.pivot.x = p.width / 2
                // p.pivot.y = p.height / 2
                TweenMax.to(p.scale, isFrames ? 0.2 : 0, {x: 1, y: 1})
            }
            this.gameSubmitPop.draw()
        },
        drawGameSubmitInfo(p) {
            let style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 24,
                fill: '#fff',
                fontWeight: 'bold'
            }
            let yellow = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 22,
                fill: '#efd100',
                fontWeight: 'bold'
            }
            // 彩種名
            const info_lottery = new Text({ text: this.$t(this.lotteryNameKey), style, x: 70, y: this.orderFuture ? 94 : 101, p, anchor: {x: 0, y: 0} })
            style.fontSize = 20
            // 起始期號
            const info_issue = new Text({ text: this.$t('Glory_0009') + '：', style, x: 70, y: this.orderFuture ? 127 : 133, p, anchor: {x: 0, y: 0} })
            const info_issueText = this.gameSubmitnewIssueText = new Text({ text: this.ltIssueStart, style, x: info_issue.x + info_issue.width, y: this.orderFuture ? 127 : 133, p, anchor: {x: 0, y: 0} })
            if (this.orderFuture) {
                // 追號期數： X 期
                const info_trace = new MutiText(
                    { text: `${this.$t('common_080')}：<yellow> ${this.orderFutureNum} </yellow>${this.$t('common_081')}`, style, x: 70, y: this.orderFuture ? 157 : 162, p, anchor: {x: 0, y: 0} },
                    {
                        default: style,
                        yellow
                    }
                )
            } else {
                info_lottery.y += 5
                info_issue.y += 10
                info_issueText.y += 10
            }
            // 共幾注
            const total_text = new MutiText(
                { text: this.$t('popup_010', {'0': `<yellow> ${this.numCalc} </yellow>`}), x: 70, y: this.orderFuture ? 529 : 487, p },
                {
                    default: style,
                    yellow
                }
            )
            // style = { fontFamily: 'Microsoft Yahei', fontSize: 22, fill: '#efd100', fontWeight: 'bold' }
            // 共幾元
            const total_money = new MutiText(
                { text: this.$t('common_074', {'0': `<yellow> ${formatNumber(this.ltMoneyAmout || 0)} </yellow>`, '1': this.currencySymbol}), x: total_text.trueX + total_text.width + 10, y: this.orderFuture ? 529 : 487, p },
                {
                    default: style,
                    yellow
                }
            )
            // 可用餘額
            const bet_money = new MutiText(
                { text: this.$t('popup_011', {'0': `<yellow> ${this.getBalance} </yellow>`}), x: 70, y: this.orderFuture ? 562 : 520, p },
                {
                    default: style,
                    yellow
                }
            )
            // this.$t('popup_011', {'0': this.number})

            // this.betTable = this.betArr.map(({name, content, odd, amount}, i) => {
            //     const x = 190
            //     const y = 228 + (i * 40)
            //     //const betText = new Text({ text: this.name, style, p, anchor: { x: 0, y: 0 } })
            //     const betTableName = new Text({ text: name, style, p, y, anchor: {x: 0, y: 0} })
            //     betTableName.x = betTableName.x - betTableName.width / 2
            // })
        },
        drawGameSubmitTitle(p) {
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 20,
                fill: '#fff'
            }
            this.lang !== 'cn' && (style.fontSize = 16)
            const popTable = new Graphics(p, {name: 'popTable', x: 54, y: 198, alpha: 0.9})
            popTable.beginFill(0x000000)
                .moveTo(5, 0)
                .lineTo(645, 0)
                .quadraticCurveTo(648, 0, 648, 5)
                .lineTo(648, 40)
                .lineTo(0, 40)
                .lineTo(0, 5)
                .quadraticCurveTo(0, 0, 5, 0)
                .lineTo(124, 0)
                .endFill()
            // 項目
            const bet_name = new Text({ text: this.$t('popup_006'), style, x: 20, y: 20, anchor: {x: 0, y: 0.5}, p: popTable })
            // 投注內容
            const bet_content = new Text({ text: this.$t('popup_007'), style, x: 218, y: 20, anchor: {x: 0, y: 0.5}, p: popTable })
            // 賠率
            const bet_odd = new Text({ text: this.$t('popup_008'), style, x: 387, y: 20, anchor: {x: 0, y: 0.5}, p: popTable })
            // 投注金額
            const bet_amount = new Text({ text: this.$t('popup_009'), style, x: 634, y: 20, anchor: {x: 1, y: 0.5}, p: popTable })
        },
        drawGameSubmitScroll(p, child) {
            child.x = 0
            child.y = 0
            const scrollbox = new Scrollbox({
                boxWidth: 650,
                boxHeight: 220,
                scrollbarBackgroundAlpha: 0,
                scrollbarForeground: 0x000000,
                scrollbarForegroundAlpha: 0.2
            })
            scrollbox.position.set(54, 235)
            p.addChild(scrollbox)
            scrollbox.content.addChild(child)
            scrollbox.content.cacheBitmapAsBitmap = true
            scrollbox.update()
        },
        drawGameSubmitContent(p) {
            const content = new Graphics(p, {name: 'popTable', x: 54, y: 235})
            content.beginFill(0x000000)
                .drawRect(0, 0, 650, 0)
                .endFill()
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 20,
                fill: '#fff',
                // stroke: '#054349',
                // strokeThickness: 2,
                fontWeight: 'bold'
            }
            this.lang !== 'cn' && (style.fontSize = 16)
            // 賠率更新用
            const redStyle = {...style, fill: '#ff7bac'}
            const xArr = [625, 387, 216, 20]
            let methodTitle = []
            this.projects.forEach((project, i) => {
                let y = i * 35
                const tr = new Container(content, {name: 'tr', y})
                y = 25
                // 投注金額
                let text = formatNumber(project.money)
                const money = new Text({ text, style, x: xArr[0], y, anchor: {x: 1, y: 0.5}, p: tr })
                // 賠率
                if (project.prizeNameArr) {
                    text = project.hprize
                        .split(',')
                        .map((prize, i) => {
                            const val = formatNumber((prize - 1).strip())
                            return (project.isUpdated || [])[i] ? `<red>${val}</red>` : val
                        })
                        .join('/')
                    const hprize = new MutiText(
                        { text, x: xArr[1], y, anchor: {x: 0, y: 0.5}, p: tr },
                        {
                            default: style,
                            red: redStyle
                        }
                    )
                    // 置中對齊
                    // hprize.x -= hprize.trueWidth / 2
                } else {
                    text = formatNumber((project.hprize - 1).strip())
                    const hprize = new Text({ text, style: project.isUpdated ? redStyle : style, x: xArr[1], y, anchor: {x: 0, y: 0.5}, p: tr })
                }
                // 投注內容
                text = this.$t(project.title_key || project.title)
                const isOver = project.isOver || project.isBonusOver
                methodTitle[i] = new Text({ text, style: isOver ? redStyle : style, x: xArr[2], y, anchor: {x: 0, y: 0.5}, p: tr })
                // 項目
                text = this.$t(project.upperName_key || project.upperName)
                const upperNane = new Text({ text, style, x: xArr[3], y, anchor: {x: 0, y: 0.5}, p: tr })
            })
            this.gameSubmitPop.methodReset = () => {
                methodTitle.forEach(text => (text.style.fill = '#fff'))
            }
            content.height > 220 && this.drawGameSubmitScroll(p, content)
        },
        drawGameSubmitBtn(p) {
            //按鈕
            const btn_submit = new Button({ id: 'pop', key: 'btn_active', x: 540, y: this.orderFuture ? 611 : 570, anchor: {x: 0.5, y: 0.5}, p }, {
                down: { scale: {x: 0.9, y: 0.9} },
                up: {
                    scale: {x: 1, y: 1},
                    fn: async () => {
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})

                        // 設定中獎即停
                        this.setFutureBingoStop()

                        btn_submit.eventOff()
                        const res = await this[_M.TABLE_GAME_ORDER_SUBMIT](this)
                        if (!res) {
                            this.handleReset()
                            this.moneyPlace && this.moneyPlace.reset()
                        } else {
                            btn_submit.eventOn()
                        }
                    }
                },
                out: { scale: {x: 1, y: 1} }
            })
            const btn_cancel = new Button({ id: 'pop', key: 'btn_default', x: 214, y: this.orderFuture ? 611 : 570, anchor: {x: 0.5, y: 0.5}, p }, {
                down: { scale: {x: 0.9, y: 0.9} },
                up: {
                    scale: {x: 1, y: 1},
                    fn: () => {
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        this.gameSubmitPopDestroy()
                    }
                },
                out: { scale: {x: 1, y: 1} }
            })
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
            const submit_text = new Text({ text: this.$t('popup_004'), style, x: 0, y: 0, p: btn_submit })
            const cancel_text = new Text({ text: this.$t('popup_013'), style, x: 0, y: 0, p: btn_cancel })
        },
        newLineFormat(oriString) {
            return oriString.split(',').map(key => this.$t(key)).join(',')
        },
        gameSubmitPopDestroy() {
            this.mask.hide()
            this.gameSubmitPop.destroy({children: true})
            this.gameSubmitPop = null
        },
        //追號
        drawTrace(p) {
            // '中獎即停'標題 style
            let style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 23,
                fill: '#fff',
                fontWeight: 'bold'
            }

            if (this.orderFuture) {
                const traceContent = new ButtonMixin(p, { name: 'traceContent', x: 70, y: 473 }, {
                    up: {
                        fn: () => {
                            this.isTrace = !this.isTrace
                            trace_checkicon.visible = this.isTrace
                        }
                    }
                })

                // '中奖即停'
                const trace_text = new Text({ text: this.$t('common_111'), style, x: 40, y: 3, p: traceContent, anchor: {x: 0, y: 0} })
                // 背景方塊
                const trace_checkbox = new Graphics(traceContent, {name: 'trace_checkbox', x: 0, y: 3})
                trace_checkbox.beginFill((!this.isTraceDisabled) ? '0xffffff' : '0xbbbbbb')
                    .lineStyle(2, 0xcccccc)
                    .drawRoundedRect(0, 0, 30, 30, 5)
                    .endFill()

                // 前景勾勾
                const trace_checkicon = new Graphics(traceContent, {name: 'trace_icon', x: 0, y: 0})
                trace_checkicon.lineStyle(5, 0xfc0404, 1)
                    .moveTo(5, 15)
                    .lineTo(13, 25)
                    .lineTo(25, 10)
                // 預設是否勾選
                trace_checkicon.visible = this.isTrace

                // traceContent.x = 690 - traceContent.width
            }
        },
        // 設定中獎即停
        setFutureBingoStop() {
            this[_M.CHANGE_ORDER_FUTURE_BINGOSTOP](this.isTrace)
        }
    },
    computed: {
        numCalc() {
            return formatNumber(this.ltProjectNum || 0)
        },
        ltIssueStart() {
            return this.gameSubmit.ltIssueStart
        },
        projects() {
            return Object
                .values(this.creditGameLtProject)
                .sort((a, b) => a.sortId - b.sortId)
        }
    }
}
</script>