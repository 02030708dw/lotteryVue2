<script>
import drag from '@C/pixi/drag'
import Method from '@C/games/components/Table/Method'
import MethodSB from '../components/methodSB'
import Container from '@C/pixi/components/Container'
// import * as PIXI from 'pixi.js'

export default {
    name: 'drawMehod',
    beforeMount() {
        this.drawFnFlow.push(
            // // 大小
            this.drawBS,
            // // 單雙
            this.drawOE,
            // // 對子
            this.drawDUIZI,
            // // 和值
            this.drawHezhi,
            // // 二碼
            this.drawERMA,
            // // 一碼
            this.drawYima,
            // 豹子通選
            this.drawBaoziTongxuan,
            // 豹子
            this.drawBaozi
            // this.drawTest
            // this.drawTest2
            // this.drawCicleTest
        )
        this.resourceArr.push(
            { id: 'dice', file: 'dice/sp.json' },
            { id: 'hezhi', file: 'hezhi/sp.json' },
            { id: 'BS', file: 'statusborder/BS/sp.json' },
            { id: 'OE', file: 'statusborder/OE/sp.json' }
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
            test.x = 186
            test.y = 445
            test.lineStyle(1, 0xff0000)
                .moveTo(60, 120)
                .lineTo(40, 120)
                .quadraticCurveTo(15, 120, 0, 105)
                .moveTo(99, 3)
                .lineTo(99, 105)
                .quadraticCurveTo(99, 120, 85, 120)
                .lineTo(60, 120)
                .moveTo(99, 3)
                .quadraticCurveTo(98, 0, 97, 0)
                .lineStyle(2, 0xffffff)
                .lineTo(0, 105)
                // .quadraticCurveTo(0, 90, 14, 107)
                // .lineTo(110, 2)
                // .quadraticCurveTo(110, 0, 107, 0)
                // .lineTo(15, 0)
                // .lineTo(105, 120)
                // .quadraticCurveTo(112, 120, 112, 115)
                // .lineTo(112, 7)
                // .quadraticCurveTo(112, 0, 105, 0)
                // .lineTo(15, 0)
                // .lineStyle(2, 0x000000)
                // .moveTo(108, 2)
                // .lineTo(14, 107)
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
        drawBS() {
            // 大小
            const style = {
                fontSize: 14,
                fill: '#efd100'
            }
            const style2 = {
                fontSize: 14,
                fill: ['#ffffff', '#11d5ff'],
                fontWeight: 'bold',
                stroke: '#175176',
                strokeThickness: 3,
                fontFamily: 'Microsoft Yahei'
            }
            const style3 = {
                fontSize: 32,
                fill: ['#ffffff', '#e2f7ff'],
                fontWeight: 'bold',
                stroke: '#026e9d',
                strokeThickness: 3,
                fontFamily: 'Microsoft Yahei',
                dropShadow: true,
                dropShadowColor: '#026e9d',
                dropShadowBlur: 0,
                dropShadowAngle: Math.PI / 1,
                dropShadowDistance: 1
            }
            // const textStyle = { x: 29, y: 11, style }
            const Bpoints = [
                50, 3,
                109, 3,
                109, 109,
                3, 109,
                0, 50
            ]
            const Spoints = [
                50, 3,
                109, 3,
                109, 109,
                3, 109,
                3, 50,
                13, 13
            ]
            // 大漸層背景
            const stepPoint1 = [
                {point: 0, color: '#244e6f'},
                {point: 1, color: '#001134'}
            ]
            const options1 = {x1: 0, x2: 200, y1: 0, y2: 0}
            const draw1 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options1))
                Graphics
                    .lineStyle(1, lineStyle)
                    .moveTo(50, 3)
                    .quadraticCurveTo(0, 3, 0, 50)
                    .lineTo(0, 102)
                    .quadraticCurveTo(0, 112, 10, 112)
                    .lineTo(103, 112)
                    .quadraticCurveTo(113, 112, 113, 102)
                    .lineTo(112, 10)
                    .quadraticCurveTo(112, 3, 105, 3)
                    .lineTo(50, 3)
                    .endFill()
            }
            // 小漸層背景
            const stepPoint2 = [
                {point: 0, color: '#244e6f'},
                {point: 1, color: '#001134'}
            ]
            const options2 = {x1: 0, x2: 0, y1: 0, y2: 200}
            const draw2 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint2, options2))
                Graphics
                    .lineStyle(1, lineStyle)
                    .moveTo(50, 3)
                    .quadraticCurveTo(0, 3, 0, 50)
                    .lineTo(0, 102)
                    .quadraticCurveTo(0, 112, 10, 112)
                    .lineTo(103, 112)
                    .quadraticCurveTo(113, 112, 113, 102)
                    .lineTo(112, 10)
                    .quadraticCurveTo(112, 3, 105, 3)
                    .lineTo(50, 3)
                    .endFill()
            }
            const obj = {
                pos: [
                    {x: 136, y: 98, draw: draw1, anchor: {x: 1, y: 0.5}, hitArea: new PIXI.Polygon(Bpoints)},
                    {x: 1142, y: 98, draw: draw2, anchor: {x: 0, y: 0.5}, scale: {x: -1, y: 1}, hitArea: new PIXI.Polygon(Spoints)}
                ]
            }
            // 多語處理
            if (this.lang === 'cn') {
                obj.title = [
                    [{ x: 57, y: 80, id: 'BS', key: 'big' }],
                    [{ x: 56, y: 78, id: 'BS', key: 'small', scale: {x: -1, y: 1} }]
                ]
                obj.text = [
                    [
                        { x: 85, y: 40, style },
                        { text: 'BIG 11-17', x: 34, y: 23, style: style2, anchor: {x: 0, y: 0.5}, isNotPrize: true }
                    ],
                    [
                        { x: 88, y: 40, scale: {x: -1, y: 1}, style },
                        { text: 'SMALL 4-10', x: 23, y: 21, style: style2, anchor: {x: 1, y: 0.5}, scale: {x: -1, y: 1}, isNotPrize: true }
                    ]
                ]
            } else {
                obj.title = [
                    [{ x: 48, y: 22, id: 'BS', key: 'big', width: 20, height: 20 }],
                    [{ x: 94, y: 22, id: 'BS', key: 'small', scale: {x: -1, y: 1}, width: 20, height: 20 }]
                ]
                obj.text = [
                    [
                        { x: 85, y: 40, style },
                        { text: '11-17', x: 60, y: 23, style: style2, anchor: {x: 0, y: 0.5}, isNotPrize: true },
                        { text: this.$t('4d_t_055'), x: 55, y: 75, style: style3, isNotPrize: true }
                    ],
                    [
                        { x: 88, y: 40, scale: {x: -1, y: 1}, style },
                        { text: '4-10', x: 44, y: 21, style: style2, anchor: {x: 1, y: 0.5}, scale: {x: -1, y: 1}, isNotPrize: true },
                        { text: this.$t('4d_t_056'), x: 58, y: 75, style: style3, scale: {x: -1, y: 1}, isNotPrize: true }
                    ]
                ]
            }
            this.drawMethod(obj, 'daxiao')
        },
        drawOE() {
            // 單雙
            const style = {
                fontSize: 14,
                fill: '#efd100'
            }
            const style2 = {
                fontSize: 28,
                fill: ['#ffffff', '#e2f7ff'],
                fontWeight: 'bold',
                stroke: '#026e9d',
                strokeThickness: 3,
                fontFamily: 'Microsoft Yahei'
            }
            const points = [
                3, 3,
                109, 3,
                109, 65,
                3, 65
            ]
            const hitArea = new PIXI.Polygon(points)
            // 單漸層背景
            const stepPoint1 = [
                {point: 0, color: '#244e6f'},
                {point: 1, color: '#001134'}
            ]
            const options1 = {x1: 0, x2: 200, y1: 0, y2: 30}
            const draw1 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options1))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 112, 64, 10)
                    .endFill()
            }
            // 雙漸層背景
            const stepPoint2 = [
                {point: 0, color: '#244e6f'},
                {point: 1, color: '#001134'}
            ]
            const options2 = {x1: -112, x2: 112, y1: 0, y2: 30}
            const draw2 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint2, options2))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 112, 64, 10)
                    .endFill()
            }
            const maxCoin = 15
            const obj = {
                pos: [
                    {x: 136, y: 216, maxCoin, draw: draw1, hitArea},
                    {x: 1029.3, y: 216, maxCoin, draw: draw2, hitArea}
                ]
            }
            // 多語處理
            if (this.lang === 'cn') {
                obj.title = [
                    [{ x: 60, y: 42, id: 'OE', key: 'odd' }],
                    [{ x: 60, y: 42, id: 'OE', key: 'even' }]
                ]
                obj.text = [
                    { x: 85, y: 15, style },
                    { x: 30, y: 15, style }
                ]
            } else {
                obj.title = [
                    [{ x: 17, y: 18, id: 'OE', key: 'odd', width: 20, height: 20 }],
                    [{ x: 94, y: 17, id: 'OE', key: 'even', width: 20, height: 20 }]
                ]
                obj.text = [
                    [
                        { x: 85, y: 15, style },
                        { text: this.$t('4d_t_057'), x: 54, y: 41, style: style2, isNotPrize: true }
                    ],
                    [
                        { x: 30, y: 15, style },
                        { text: this.$t('4d_t_058'), x: 57, y: 41, style: style2, isNotPrize: true }
                    ]
                ]
            }
            this.drawMethod(obj, 'danshuang')
        },
        drawDUIZI() {
            // 對子
            // 66 55 44 33 22 11
            const style = {
                fontSize: 14,
                fill: '#efd100'
            }
            const textStyle = { x: 70, y: 9, style }
            const points = [
                3, 3,
                138, 3,
                138, 52,
                3, 52
            ]
            const hitArea = new PIXI.Polygon(points)

            // 對子漸層背景1,2,4
            const stepPoint1 = [
                {point: 0, color: '#244e6f'},
                {point: 1, color: '#001134'}
            ]
            const options1 = {x1: 140, x2: 0, y1: 0, y2: 0}
            const draw1 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options1))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 140, 55, 10)
                    .endFill()
            }
            // 對子漸層背景3,6
            const options3 = {x1: 300, x2: 0, y1: 0, y2: 0}
            const draw3 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options3))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 140, 55, 10)
                    .endFill()
            }
            // 對子漸層背景5
            const options5 = {x1: -50, x2: 140, y1: 0, y2: 0}
            const draw5 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options5))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 140, 55, 10)
                    .endFill()
            }
            // 對子漸層背景6
            const options6 = {x1: 0, x2: 140, y1: 0, y2: 30}
            const draw6 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options6))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 140, 55, 10)
                    .endFill()
            }
            const maxCoin = 15
            const obj = {
                pos: [
                    {x: 257, y: 100, draw: draw1, hitArea, maxCoin},
                    {x: 257, y: 162.2, draw: draw1, hitArea, maxCoin},
                    {x: 257, y: 224, draw: draw3, hitArea, maxCoin},
                    {x: 881, y: 103, draw: draw1, hitArea, maxCoin},
                    {x: 881, y: 162.2, draw: draw5, hitArea, maxCoin},
                    {x: 881, y: 224, draw: draw3, hitArea, maxCoin}
                ],
                title: [
                    [
                        { x: 50, y: 35, width: 35, height: 35, id: 'dice', key: 'dice6' },
                        { x: 90, y: 35, width: 35, height: 35, id: 'dice', key: 'dice6' }
                    ],
                    [
                        { x: 50, y: 35, width: 35, height: 35, id: 'dice', key: 'dice5' },
                        { x: 90, y: 35, width: 35, height: 35, id: 'dice', key: 'dice5' }
                    ],
                    [
                        { x: 50, y: 35, width: 35, height: 35, id: 'dice', key: 'dice4' },
                        { x: 90, y: 35, width: 35, height: 35, id: 'dice', key: 'dice4' }
                    ],
                    [
                        { x: 50, y: 35, width: 35, height: 35, id: 'dice', key: 'dice3' },
                        { x: 90, y: 35, width: 35, height: 35, id: 'dice', key: 'dice3' }
                    ],
                    [
                        { x: 50, y: 35, width: 35, height: 35, id: 'dice', key: 'dice2' },
                        { x: 90, y: 35, width: 35, height: 35, id: 'dice', key: 'dice2' }
                    ],
                    [
                        { x: 50, y: 35, width: 35, height: 35, id: 'dice', key: 'dice1' },
                        { x: 90, y: 35, width: 35, height: 35, id: 'dice', key: 'dice1' }
                    ]
                ],
                text: [
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle
                ],
                // 繪製順序跟投注資料順序相反
                reverse: true
            }
            this.drawMethod(obj, 'duizi')
        },
        drawHezhi() {
            //繪製和值
            // 17 16 15 14 13 12 11 10 09 08 07 06 05 04
            const style = {
                fontSize: 13,
                fill: '#efd100'
            }
            const points = [
                3, 3,
                3, 68,
                63, 68,
                63, 3
            ]
            const draw = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 65, 70, 10)
                    .endFill()
            }
            const maxCoin = 10
            const obj = {
                pos: [
                    {x: 136, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 208.3, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 280.7, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 353, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 425.3, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 497.6, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 569.9, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 642.2, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 714.5, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 786.8, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 859.1, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 931.4, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 1003.7, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 1076, y: 286, draw, maxCoin, hitArea: new PIXI.Polygon(points)}
                    //{x: 136, y: 286, draw: draw, area: this.drawTest()},
                ],
                title: [
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num17' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num16' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num15' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num14' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num13' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num12' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num11' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num10' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num09' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num08' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num07' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num06' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num05' }],
                    [{ x: 33, y: 45, id: 'hezhi', key: 'num04' }]
                ],
                text: [
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style},
                    {x: 34, y: 13, style}
                ],
                // 繪製順序跟投注資料順序相反
                reverse: true
            }
            this.drawMethod(obj, 'hezhi')
        },
        drawERMA() {
            // 二碼
            // 56 46 45 36 35 34 26 25 24 23 16 15 14 13 12
            const style = {
                fontSize: 14,
                fill: '#efd100'
            }
            const textStyle = { x: 29, y: 11, style }
            const points = [
                3, 3,
                51, 3,
                51, 99,
                3, 99
            ]
            const hitArea = new PIXI.Polygon(points)
            const draw = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 54, 102, 10)
                    .endFill()
            }
            const maxCoin = 10
            const obj = {
                pos: [
                    {x: 137, y: 362.5, draw, hitArea, maxCoin},
                    {x: 202, y: 362.5, draw, hitArea, maxCoin},
                    {x: 270, y: 362.5, draw, hitArea, maxCoin},
                    {x: 338, y: 362.5, draw, hitArea, maxCoin},
                    {x: 406, y: 362.5, draw, hitArea, maxCoin},
                    {x: 474, y: 362.5, draw, hitArea, maxCoin},
                    {x: 542, y: 362.5, draw, hitArea, maxCoin},
                    {x: 610, y: 362.5, draw, hitArea, maxCoin},
                    {x: 678, y: 362.5, draw, hitArea, maxCoin},
                    {x: 746, y: 362.5, draw, hitArea, maxCoin},
                    {x: 814, y: 362.5, draw, hitArea, maxCoin},
                    {x: 882, y: 362.5, draw, hitArea, maxCoin},
                    {x: 950, y: 362.5, draw, hitArea, maxCoin},
                    {x: 1018, y: 362.5, draw, hitArea, maxCoin},
                    {x: 1086, y: 362.5, draw, hitArea, maxCoin}

                ],
                title: [
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice5' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice6' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice4' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice6' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice4' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice5' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice3' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice6' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice3' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice5' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice3' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice4' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice2' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice6' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice2' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice5' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice2' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice4' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice2' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice3' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice1' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice6' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice1' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice5' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice1' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice4' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice1' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice3' }
                    ],
                    [
                        { x: 27, y: 40, width: 35, height: 35, id: 'dice', key: 'dice1' },
                        { x: 27, y: 80, width: 35, height: 35, id: 'dice', key: 'dice2' }
                    ]
                ],
                text: [
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle,
                    textStyle
                ],
                // 繪製順序跟投注資料順序相反
                reverse: true
            }
            this.drawMethod(obj, 'erma')
        },
        // 一碼
        drawYima () {
            const points = [
                5, 5,
                150, 5,
                150, 96,
                5, 96
            ]
            const pointsFirst = [
                5, 5,
                150, 5,
                150, 96,
                30, 96,
                11, 85,
                5, 66
            ]
            const hitArea = new PIXI.Polygon(points)
            const hitAreaFirst = new PIXI.Polygon(pointsFirst)

            const stepPoint = [
                {point: 0, color: '#244e6f'},
                {point: 1, color: '#001134'}
            ]
            const options1 = {x1: 154, x2: 20, y1: -10, y2: 0}
            const drawFirst = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint, options1))
                Graphics
                    .lineStyle(1, lineStyle)
                    .moveTo(10, 0)
                    .quadraticCurveTo(0, 0, 0, 10)
                    .lineTo(0, 61)
                    .quadraticCurveTo(0, 101, 50, 101)
                    .lineTo(144, 101)
                    .quadraticCurveTo(154, 101, 154, 91)
                    .lineTo(154, 10)
                    .quadraticCurveTo(154, 0, 144, 0)
                    .lineTo(10, 0)
            }
            // 外框
            const pos = Array(6).fill(0).map((item, colIndex) => {
                let isFirst = colIndex === 0
                let options2 = {}
                const draw = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                    isFill && Graphics.beginTextureFill(this.radialGradient(stepPoint, options2))
                    Graphics
                        .lineStyle(1, lineStyle)
                        .drawRoundedRect(0, 0, 154, 101, 10)
                        .endFill()
                }
                switch (colIndex) {
                    case 1: options2 = {x1: 0, x2: 30, y1: 50, y2: 50, r1: 30, r2: 100}
                        break
                    case 2: options2 = {x1: 50, x2: 70, y1: 50, y2: 50, r1: 30, r2: 120}
                        break
                    case 3: options2 = {x1: 80, x2: 80, y1: 120, y2: 110, r1: 50, r2: 140}
                        break
                    case 4: options2 = {x1: 80, x2: 80, y1: 0, y2: 20, r1: 5, r2: 100}
                        break
                    case 5: options2 = {x1: 5, x2: 50, y1: 5, y2: 50, r1: 30, r2: 100}
                        break
                }
                return {
                    // area: this.drawTest(isFirst ? pointsFirst : points),
                    x: 137 + colIndex * 170,
                    y: 470.5,
                    draw: isFirst ? drawFirst : draw,
                    hitArea: isFirst ? hitAreaFirst : hitArea
                }
            })
            // 圖示
            const title = Array(6).fill(0).map((item, colIndex) => {
                return [
                    // 骰子圖
                    { x: this.lang === 'us' || this.lang === 'vn' ? 115 : 100, y: 47, width: 50, height: 50, id: 'dice', key: `dice${6 - colIndex}` }
                ]
            })
            // 文字
            const text = Array(6).fill(0).map((item, colIndex) => {
                // 圖面繪製順序跟資料順序相反
                let dataIndex = 6 - colIndex
                const titleStyle = {
                    fontSize: 14,
                    fill: '#FFFFFF',
                    fontFamily: 'Microsoft Yahei'
                }
                const prizeStyle = {
                    fontSize: 14,
                    fill: '#efd100'
                }
                const titleData = [{
                    // '单骰'
                    text: 'hhh_t_003',
                    prizeName: `单${dataIndex}`// 這裡是中文
                }, {
                    // '双骰'
                    text: 'hhh_t_004',
                    prizeName: `双${dataIndex}`// 這裡是中文
                }, {
                    // '全骰'
                    text: 'hhh_t_005',
                    prizeName: `全${dataIndex}`// 這裡是中文
                }]

                return titleData.reduce((arr, row, rowIndex) => {
                    const {text, prizeName} = row
                    // 標題(ex:單骰)
                    // isNotPrize: 標記為非賠率文字
                    arr.push({ x: 9, y: 3 + rowIndex * 31, anchor: { x: 0, y: 0 }, style: titleStyle, text: this.$t(text), isNotPrize: true })

                    // 賠率(ex:2.321)
                    if (colIndex === 0 && rowIndex === 2) {
                    // 第一欄最後一筆資料碰到轉角要內縮
                        arr.push({ x: 34, y: 17 + rowIndex * 31, anchor: { x: 0, y: 0 }, style: prizeStyle, prizeName })
                    } else {
                        arr.push({ x: 11, y: 17 + rowIndex * 31, anchor: { x: 0, y: 0 }, style: prizeStyle, prizeName })
                    }
                    return arr
                }, [])
            })

            const obj = {
                pos,
                title,
                text
            }
            this.drawMethodYima(obj)
        },
        drawBaoziTongxuan() {
            // 豹子通選
            // 666 555 444 333 222 111
            const style = {
                fontSize: 13,
                fill: '#efd100'
            }
            const points = [
                3, 3,
                3, 82,
                463, 82,
                463, 3
            ]
            const draw = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics.lineStyle(1, lineStyle)
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 465, 85, 10)
                    .endFill()
            }
            const obj = {
                pos: [
                    {x: 407, y: 195, draw: draw, hitArea: new PIXI.Polygon(points)}
                ],
                title: [
                    [
                        { x: 45, y: 34, width: 25, height: 25, id: 'dice', key: 'dice6' },
                        { x: 30, y: 64, width: 25, height: 25, id: 'dice', key: 'dice6' },
                        { x: 61, y: 64, width: 25, height: 25, id: 'dice', key: 'dice6' },
                        { x: 120, y: 34, width: 25, height: 25, id: 'dice', key: 'dice5' },
                        { x: 105, y: 64, width: 25, height: 25, id: 'dice', key: 'dice5' },
                        { x: 136, y: 64, width: 25, height: 25, id: 'dice', key: 'dice5' },
                        { x: 195, y: 34, width: 25, height: 25, id: 'dice', key: 'dice4' },
                        { x: 180, y: 64, width: 25, height: 25, id: 'dice', key: 'dice4' },
                        { x: 211, y: 64, width: 25, height: 25, id: 'dice', key: 'dice4' },
                        { x: 270, y: 34, width: 25, height: 25, id: 'dice', key: 'dice3' },
                        { x: 255, y: 64, width: 25, height: 25, id: 'dice', key: 'dice3' },
                        { x: 286, y: 64, width: 25, height: 25, id: 'dice', key: 'dice3' },
                        { x: 345, y: 34, width: 25, height: 25, id: 'dice', key: 'dice2' },
                        { x: 330, y: 64, width: 25, height: 25, id: 'dice', key: 'dice2' },
                        { x: 361, y: 64, width: 25, height: 25, id: 'dice', key: 'dice2' },
                        { x: 420, y: 34, width: 25, height: 25, id: 'dice', key: 'dice1' },
                        { x: 405, y: 64, width: 25, height: 25, id: 'dice', key: 'dice1' },
                        { x: 436, y: 64, width: 25, height: 25, id: 'dice', key: 'dice1' }
                    ]
                ],
                text: [
                    {x: 240, y: 10, style}
                ]
            }
            this.drawMethod(obj, 'baozitongxuan')
        },
        drawBaozi() {
            //豹子
            const style = {
                fontSize: 13,
                fill: '#efd100'
            }
            const points = [
                3, 3,
                3, 82,
                70, 82,
                70, 3
            ]
            // 豹子漸層背景1
            const stepPoint1 = [
                {point: 0, color: '#244e6f'},
                {point: 1, color: '#001134'}
            ]
            const options1 = {x1: 60, x2: 20, y1: -10, y2: 0}
            const draw1 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options1))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 72, 85, 10)
                    .endFill()
            }

            // 豹子漸層背景2
            const options2 = {x1: 20, x2: 60, y1: -10, y2: 0}
            const draw2 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options2))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 72, 85, 10)
                    .endFill()
            }

            // 豹子漸層背景3
            const options3 = {x1: 0, x2: 0, y1: 0, y2: 72}
            const draw3 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options3))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 72, 85, 10)
                    .endFill()
            }

            // 豹子漸層背景4
            const options4 = {x1: 0, x2: 0, y1: 72, y2: 0}
            const draw4 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options4))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 72, 85, 10)
                    .endFill()
            }

            // 豹子漸層背景5
            const options5 = {x1: -72, x2: 60, y1: 0, y2: 0}
            const draw5 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options5))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 72, 85, 10)
                    .endFill()
            }

            // 豹子漸層背景6
            const options6 = {x1: 0, x2: 140, y1: 0, y2: 0}
            const draw6 = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                isFill && Graphics.beginTextureFill(this.linearGradient(stepPoint1, options6))
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 72, 85, 10)
                    .endFill()
            }
            const obj = {
                pos: [
                    {x: 407, y: 101, draw: draw1, hitArea: new PIXI.Polygon(points)},
                    {x: 485.6, y: 101, draw: draw2, hitArea: new PIXI.Polygon(points)},
                    {x: 564.2, y: 101, draw: draw3, hitArea: new PIXI.Polygon(points)},
                    {x: 642.8, y: 101, draw: draw4, hitArea: new PIXI.Polygon(points)},
                    {x: 721.4, y: 101, draw: draw5, hitArea: new PIXI.Polygon(points)},
                    {x: 800.3, y: 101, draw: draw6, hitArea: new PIXI.Polygon(points)}
                ],
                title: [
                    [
                        { x: 35, y: 38, width: 25, height: 25, id: 'dice', key: 'dice6' },
                        { x: 22, y: 67, width: 25, height: 25, id: 'dice', key: 'dice6' },
                        { x: 51, y: 67, width: 25, height: 25, id: 'dice', key: 'dice6' }
                    ],
                    [
                        { x: 35, y: 38, width: 25, height: 25, id: 'dice', key: 'dice5' },
                        { x: 22, y: 67, width: 25, height: 25, id: 'dice', key: 'dice5' },
                        { x: 51, y: 67, width: 25, height: 25, id: 'dice', key: 'dice5' }
                    ],
                    [
                        { x: 35, y: 38, width: 25, height: 25, id: 'dice', key: 'dice4' },
                        { x: 22, y: 67, width: 25, height: 25, id: 'dice', key: 'dice4' },
                        { x: 51, y: 67, width: 25, height: 25, id: 'dice', key: 'dice4' }
                    ],
                    [
                        { x: 35, y: 38, width: 25, height: 25, id: 'dice', key: 'dice3' },
                        { x: 22, y: 67, width: 25, height: 25, id: 'dice', key: 'dice3' },
                        { x: 51, y: 67, width: 25, height: 25, id: 'dice', key: 'dice3' }
                    ],
                    [
                        { x: 35, y: 38, width: 25, height: 25, id: 'dice', key: 'dice2' },
                        { x: 22, y: 67, width: 25, height: 25, id: 'dice', key: 'dice2' },
                        { x: 51, y: 67, width: 25, height: 25, id: 'dice', key: 'dice2' }
                    ],
                    [
                        { x: 35, y: 38, width: 25, height: 25, id: 'dice', key: 'dice1' },
                        { x: 22, y: 67, width: 25, height: 25, id: 'dice', key: 'dice1' },
                        { x: 51, y: 67, width: 25, height: 25, id: 'dice', key: 'dice1' }
                    ]
                ],
                text: [
                    {x: 37, y: 12, style},
                    {x: 37, y: 12, style},
                    {x: 37, y: 12, style},
                    {x: 37, y: 12, style},
                    {x: 37, y: 12, style},
                    {x: 37, y: 12, style}
                ],
                // 繪製順序跟投注資料順序相反
                reverse: true
            }
            this.drawMethod(obj, 'baozi')
        },
        // 繪製玩法
        drawMethod({pos, text, title, reverse}, dataKey) {
            const p = new Container(this.container, {name: dataKey, sortableChildren: true})
            pos.forEach((options, i) => {
                // reverse: 資料跟繪製順序相反
                const method = this[dataKey][reverse ? pos.length - i - 1 : i]
                const key = method.key = `${method.methodId}_${method.title}`
                const data = { p, method, ...options }
                this.stopBet[key] && (data.statusCode = 9501)
                this.spritesTemp[key] = new Method(data, text[i], title[i], this.handleClick, this.prize)
                this.spritesNameTemp.push(key)
            })
        },
        // 繪製一碼
        drawMethodYima({pos, text, title}) {
            const p = new Container(this.container, {name: 'yima', sortableChildren: true})
            pos.forEach((options, i) => {
                // 資料跟繪製順序相反
                const method = this.yima[5 - i]
                const key = method.key = `${method.methodId}_单${method.title}`
                const data = { p, method, ...options }
                this.stopBet[key] && (data.statusCode = 9501)
                this.spritesTemp[key] = new MethodSB(data, text[i], title[i], this.handleClick, this.getPrizeMulti)
                this.spritesNameTemp.push(key)
            })
        }
    },
    computed: {
        // 一碼
        yima() {
            return this.gameMenu[0].childs[0].childs
        },
        // 大小
        daxiao() {
            return this.gameMenu[0].childs[1].childs
        },
        // 單雙
        danshuang() {
            return this.gameMenu[0].childs[2].childs
        },
        // 豹子通選
        baozitongxuan() {
            return this.gameMenu[0].childs[3].childs
        },
        // 豹子
        baozi() {
            return this.gameMenu[0].childs[4].childs
        },
        // 對子
        duizi() {
            return this.gameMenu[0].childs[5].childs
        },
        // 二碼
        erma() {
            return this.gameMenu[0].childs[6].childs
        },
        // 和值
        hezhi() {
            return this.gameMenu[0].childs[7].childs
        }
    }
}
</script>