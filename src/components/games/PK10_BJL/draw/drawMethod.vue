<script>
import drag from '@C/pixi/drag'
import Method from '../components/Method'
import Sprite from '@C/pixi/components/Sprite'
import Container from '@C/pixi/components/Container'
// import Container3d from '@C/pixi/components/Container3d'
// import * as PIXI from 'pixi.js'

export default {
    name: 'drawMehod',
    beforeMount() {
        this.drawFnFlow.push(
            this.drawBS,
            this.drawBP,
            this.drawBarkerAndPlayerAndTie
            // this.drawTest,
            // this.drawTest2
            // this.drawCicleTest
        )
        this.resourceArr.push(
            // { id: 'Num', file: 'statusBorder/0-9/sp.json' },
            // { id: 'lS', file: 'statusBorder/0-9/lS.json' },
            // { id: 'OE', file: 'statusBorder/OE/sp.json' },
            // { id: 'BS', file: 'statusBorder/BS/sp.json' },
            // { id: 'LHD', file: 'statusBorder/LHD/sp.json' },
            // { id: 'wuxing', file: 'statusBorder/wuxing/sp.json' }
        )
    },
    methods: {
        drawTest(points) {
            const test = new PIXI.Graphics()
            test.beginFill(0xff0000)
            test.drawPolygon(points) //畫一個紅色方塊
            test.alpha = 0.5
            test.endFill()
            drag(test)
            // this.container.addChild(test)
            return test
        },
        // drawTest() {
        //     const test = new PIXI.Graphics()
        //     test.x = 174
        //     test.y = 445
        //     // test.beginFill(0x001134)
        //     // test.lineStyle(2, 0xff0000)
        //     //     .moveTo(15, 0)
        //     //     .quadraticCurveTo(0, 0, 0, 15)
        //     //     .lineTo(0, 70)
        //     //     .quadraticCurveTo(0, 110, 45, 120)
        //     //     .lineTo(105, 120)
        //     //     .quadraticCurveTo(112, 120, 112, 115)
        //     //     .lineTo(112, 7)
        //     //     .quadraticCurveTo(112, 0, 105, 0)
        //     //     .lineTo(15, 0)
        //     //     .lineStyle(2, 0x000000)
        //     //     .moveTo(108, 2)
        //     //     .lineTo(14, 107)
        //     //     .endFill()
        //     test.beginFill(0x001134)
        //     test.lineStyle(1, 0xff0000)
        //         .moveTo(15, 0)
        //         .quadraticCurveTo(0, 0, 0, 15)
        //         .lineTo(0, 70)
        //         .quadraticCurveTo(0, 90, 14, 107)
        //         .lineTo(110, 2)
        //         .quadraticCurveTo(110, 0, 107, 0)
        //         .lineTo(15, 0)

        //     // test.alpha = 0.5
        //     test.zIndex = 4

        //     // drag(test)
        //     this.container.addChild(test)
        //     return test
        // },
        drawTest2() {
            const test = new PIXI.Graphics()
            test.x = 828
            test.y = 366
            test
                .lineStyle(1, 0xff0000)
                .moveTo(5, 0)
                .lineTo(208, 0)
                .quadraticCurveTo(164, 110, 25, 165)
                .lineTo(0, 6)
                .quadraticCurveTo(0, 0, 5, 0)
                // .endFill()
            // test.alpha = 0.5
            test.zIndex = 5
            // test.scale = { x: 3, y: 3}

            // drag(test)
            this.container.addChild(test)
            return test
        },
        drawCicleTest() {
            const test = new PIXI.Graphics()
            test.beginFill(0x000000)
            test.drawCircle(0, 0, 34)
            // test.drawPolygon(points) //畫一個紅色方塊
            test.alpha = 0.7
            test.endFill()
            this.container.addChild(test)
            drag(test)
        },
        // 庄對閒對
        drawBP() {
            const bankerPoint = [
                10, 8,
                195, 8,
                170, 50,
                125, 100,
                30, 160
            ]
            const playerPoint = [
                10, 8,
                198, 8,
                180, 160,
                135, 140,
                50, 70
            ]

            const style = {
                fontSize: 16,
                fill: '#ffffff',
                fontFamily: 'Microsoft Yahei'
            }
            const style2 = {
                fontSize: 60,
                fill: '#49ecf8',
                fontWeight: 'bold',
                stroke: '#175176',
                strokeThickness: 3,
                fontFamily: 'Microsoft Yahei',
                dropShadow: true,
                dropShadowColor: '#0b3548',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 8
            }
            const langObj = {
                cn: 60,
                us: 25,
                jp: 25,
                th: 25,
                vn: 20
            }
            style2.fontSize = langObj[this.lang] || 60
            const textStyle = {x: 107, y: 88, style}
            // 庄對右
            const draw1 = (Graphics, {lineStyle = 0xffffff, weight = 1}) => {
                Graphics
                    .lineStyle(weight, lineStyle)
                    .moveTo(5, 0)
                    .lineTo(208, 0)
                    .quadraticCurveTo(164, 110, 25, 165)
                    .lineTo(0, 6)
                    .quadraticCurveTo(0, 0, 5, 0)
                    .endFill()
            }
            // 閒對左
            const draw2 = (Graphics, {lineStyle = 0xffffff, weight = 1}) => {
                Graphics
                    .lineStyle(weight, lineStyle)
                    .moveTo(203, 0)
                    .lineTo(1, 0)
                    .quadraticCurveTo(45, 110, 187, 167)
                    .lineTo(208, 6)
                    .quadraticCurveTo(206, 0, 203, 0)
                    .endFill()
            }
            const obj = {
                pos: [
                    {x: 828, y: 366, draw: draw1, hitArea: new PIXI.Polygon(bankerPoint)},
                    {x: 262, y: 366, draw: draw2, hitArea: new PIXI.Polygon(playerPoint)}
                ]
            }
            // 多語處理
            // if (this.lang === 'cn') {
            obj.title = [
                [],
                []
            ]
            obj.text = [
                [
                    textStyle,
                    { text: this.$t('baccarat_003'), x: 102, y: 32, skew: {x: 0.2, y: 0}, scale: {x: 1, y: 0.6}, style: style2, isNotPrize: true } // 庄对
                ],
                [
                    textStyle,
                    { text: this.$t('baccarat_004'), x: 112, y: 32, skew: {x: -0.15, y: 0}, scale: {x: 1, y: 0.6}, style: style2, isNotPrize: true } // 闲对
                ]
            ]
            this.drawMethod(obj, 'pair')
        },
        drawBS() {
            // 左大右小
            const bigPoint = [
                5, 15,
                15, 5,
                150, 5,
                160, 15,
                160, 195,
                5, 169,
                -5, 159
            ]
            const smallpoint = [
                5, 15,
                15, 5,
                150, 5,
                160, 15,
                180, 169,
                15, 195,
                8, 190
            ]

            const style = {
                fontSize: 16,
                fill: '#ffffff',
                fontFamily: 'Microsoft Yahei'
            }
            const style2 = {
                fontSize: 60,
                fill: '#49ecf8',
                fontWeight: 'bold',
                stroke: '#175176',
                strokeThickness: 3,
                fontFamily: 'Microsoft Yahei',
                dropShadow: true,
                dropShadowColor: '#0b3548',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 8
            }
            const langObj = {
                cn: 60,
                us: 30,
                jp: 40,
                th: 30,
                vn: 30
            }
            style2.fontSize = langObj[this.lang] || 60
            const textStyle = {x: 84, y: 88, style}
            // 左
            const draw1 = (Graphics, {lineStyle = 0xffffff, weight = 1}) => {
                Graphics
                    .lineStyle(weight, lineStyle)
                    .moveTo(7, 0)
                    .lineTo(162, 0)
                    .quadraticCurveTo(167, 0, 169, 5)
                    .lineTo(171, 203)
                    .quadraticCurveTo(62, 200, -21, 169)
                    .lineTo(1, 6)
                    .quadraticCurveTo(1, 0, 7, 0)
                    .endFill()
            }
            // 右
            const draw2 = (Graphics, {lineStyle = 0xffffff, weight = 1}) => {
                Graphics
                    .lineStyle(weight, lineStyle)
                    .moveTo(160, 0)
                    .lineTo(7, 0)
                    .quadraticCurveTo(0, 0, 0, 6)
                    .lineTo(4, 203)
                    .quadraticCurveTo(110, 200, 194, 169)
                    .lineTo(168, 5)
                    .quadraticCurveTo(165, 0, 160, 0)
                    .endFill()
            }
            const obj = {
                pos: [
                    {x: 476, y: 366, draw: draw1, hitArea: new PIXI.Polygon(bigPoint)},
                    {x: 651, y: 366, draw: draw2, hitArea: new PIXI.Polygon(smallpoint)}
                ]
            }
            // 多語處理
            // if (this.lang === 'cn') {
            obj.title = [
                [],
                []
            ]
            obj.text = [
                [
                    textStyle,
                    { text: this.$t('pk10_t_016'), x: 88, y: 35, scale: {x: 1, y: 0.6}, style: style2, isNotPrize: true } // 大
                ],
                [
                    textStyle,
                    { text: this.$t('pk10_t_017'), x: 88, y: 35, scale: {x: 1, y: 0.6}, style: style2, isNotPrize: true } // 小
                ]
            ]
            this.drawMethod(obj, 'bigSmall')
        },
        drawBarkerAndPlayerAndTie() {
            // 庄家
            const barker = [
                5, 15,
                15, 5,
                215, 5,
                220, 15,
                230, 85,
                225, 90,
                20, 90,
                15, 80
            ]
            // 閒家
            const player = [
                5, 15,
                15, 5,
                215, 5,
                220, 15,
                210, 85,
                200, 90,
                5, 90,
                -5, 80
            ]
            // 和
            const tie = [
                5, 15,
                15, 5,
                300, 5,
                310, 15,
                320, 85,
                310, 90,
                5, 90,
                -5, 80
            ]
            const style = {
                fontSize: 16,
                fill: '#ffffff'
            }
            const style2 = {
                fontSize: 90,
                fill: '#49ecf8',
                fontWeight: 'bold',
                stroke: '#175176',
                strokeThickness: 3,
                fontFamily: 'Microsoft Yahei',
                dropShadow: true,
                dropShadowColor: '#0b3548',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 8
            }
            const langObj = {
                cn: 90,
                us: 40,
                jp: 60,
                th: 40,
                vn: 35
            }
            style2.fontSize = langObj[this.lang] || 90
            const textStyle1 = {x: 122, y: 80, style}
            const textStyle2 = {x: 112, y: 80, style}
            const textStyle3 = {x: 152, y: 80, style}
            const draw1 = (Graphics, {lineStyle = 0xffffff, weight = 1}) => {
                Graphics
                    .lineStyle(weight, lineStyle)
                    .moveTo(218, 0)
                    .lineTo(5, 0)
                    .quadraticCurveTo(-2, 0, -3, 5)
                    .lineTo(10, 90)
                    .quadraticCurveTo(11, 96, 15, 96)
                    .lineTo(226, 96)
                    .quadraticCurveTo(240, 76, 236, 44)
                    .lineTo(225, 5)
                    .quadraticCurveTo(222, 0, 218, 0)
                    .endFill()
            }
            const draw2 = (Graphics, {lineStyle = 0xffffff, weight = 1}) => {
                Graphics
                    .lineStyle(weight, lineStyle)
                    .moveTo(5, 0)
                    .lineTo(218, 0)
                    .quadraticCurveTo(225, 0, 226, 5)
                    .lineTo(213, 90)
                    .quadraticCurveTo(208, 96, 203, 96)
                    .lineTo(-1, 96)
                    .quadraticCurveTo(-15, 76, -11, 44)
                    .lineTo(-2, 5)
                    .quadraticCurveTo(2, 0, 5, 0)
                    .endFill()
            }
            const draw3 = (Graphics, {lineStyle = 0xffffff, weight = 1}) => {
                Graphics
                    .lineStyle(weight, lineStyle)
                    .moveTo(10, 0)
                    .lineTo(305, 0)
                    .quadraticCurveTo(313, 0, 314, 5)
                    .lineTo(327, 90)
                    .quadraticCurveTo(328, 96, 324, 96)
                    .lineTo(-5, 96)
                    .quadraticCurveTo(-12, 96, -13, 91)
                    .lineTo(0, 5)
                    .quadraticCurveTo(2, 0, 10, 0)
                    .endFill()
            }
            const obj = {
                pos: [
                    {x: 813, y: 266, draw: draw1, hitArea: new PIXI.Polygon(barker)},
                    {x: 260, y: 266, draw: draw2, hitArea: new PIXI.Polygon(player)},
                    {x: 491, y: 266, draw: draw3, hitArea: new PIXI.Polygon(tie)}
                ]
            }
            // 多語處理
            // if (this.lang === 'cn') {
            obj.title = [
                [],
                [],
                []
            ]
            obj.text = [
                [
                    textStyle1,
                    // 庄
                    { text: this.$t('pk10_t_135'), x: 103, y: 42, skew: {x: 0.2, y: 0}, scale: {x: 1, y: 0.6}, style: style2, isNotPrize: true }
                ],
                [
                    textStyle2,
                    // 閒
                    { text: this.$t('baccarat_001'), x: 122, y: 42, skew: {x: -0.2, y: 0}, scale: {x: 1, y: 0.6}, style: style2, isNotPrize: true }
                ],
                [
                    textStyle3,
                    // 和
                    { text: this.$t('trend_pk10_t_017'), x: 152, y: 42, scale: {x: 1, y: 0.6}, style: style2, isNotPrize: true }
                ]
            ]
            this.drawMethod(obj, 'barkerAndPlayerAndTie')
        },
        // 繪製玩法
        drawMethod({pos, text, title}, dataKey) {
            const p = new Container(this.container, {name: dataKey, sortableChildren: true})
            pos.forEach((options, i) => {
                const method = this[dataKey][i]
                const key = method.key = `${method.methodId}_${method.title}`
                const data = { p, method, waitTime: this.waitTime, ...options }
                this.stopBet[key] && (data.statusCode = 9501)
                this.spritesTemp[key] = new Method(data, text[i], title[i], this.handleClick, this.prize)
                this.spritesNameTemp.push(key)
            })
        },
        drawMethodOpenIssueAnimation() {
            this.calcPair()
            this.calcBigSmall()
            this.calcBarkerAndPlayerAndTie()
        },
        calcBarkerAndPlayerAndTie() {
            const balls = this.lastballs
            const bookmakerPoint = this.calcBookmaker(balls) % 10
            const playerPoint = this.calcPlayer(balls) % 10
            const methodId = this.methodIdArr[0]
            let key
            if (bookmakerPoint > playerPoint) {
                key = '庄'
            } else if (bookmakerPoint === playerPoint) {
                key = '和'
            } else {
                key = '闲'
            }
            key = `${methodId}_${key}`
            this.spritesTemp[key] && this.spritesTemp[key].blankAnimation(0.4, 10)
        },
        calcPair() {
            const balls = this.lastballs
            // 庄家 前兩張牌
            const pyfirst = (+balls[0] + +balls[1]) % 10
            const pysecond = (+balls[2] + +balls[3]) % 10
            // 庄家 前兩張牌
            const bkfirst = (+balls[4] + +balls[5]) % 10
            const bksecond = (+balls[6] + +balls[7]) % 10
            const methodId = this.methodIdArr[1]
            if (pyfirst === pysecond) {
                const key = `${methodId}_闲对`
                this.spritesTemp[key] && this.spritesTemp[key].blankAnimation(0.4, 10)
            }
            if (bkfirst === bksecond) {
                const key = `${methodId}_庄对`
                this.spritesTemp[key] && this.spritesTemp[key].blankAnimation(0.4, 10)
            }
        },
        calcBigSmall() {
            const balls = this.lastballs
            const cardNums = [
                (+balls[0] + +balls[1]) % 10,
                (+balls[2] + +balls[3]) % 10,
                +balls[8],
                (+balls[4] + +balls[5]) % 10,
                (+balls[6] + +balls[7]) % 10,
                +balls[9]
            ]
            const player = this.calcPlayer(balls) !== ((cardNums[0] + cardNums[1]) % 10)
            const bookmaker = this.calcBookmaker(balls) !== ((cardNums[3] + cardNums[4]) % 10)
            const methodId = this.methodIdArr[2]
            const key = (player || bookmaker) ? `${methodId}_大` : `${methodId}_小`
            this.spritesTemp[key] && this.spritesTemp[key].blankAnimation(0.4, 10)
        }
    },
    computed: {
        // ...mapGetters([
        //     'game'
        // ])
        // 庄闲和
        barkerAndPlayerAndTie() {
            return this.gameMenu[0].childs[0].childs
        },
        pair() {
            return this.gameMenu[0].childs[1].childs
        },
        // 大小
        bigSmall() {
            return this.gameMenu[0].childs[2].childs
        },
        methodIdArr() {
            return [
                this.barkerAndPlayerAndTie[0].methodId,
                this.pair[0].methodId,
                this.bigSmall[0].methodId
            ]
        }
    }
}
</script>