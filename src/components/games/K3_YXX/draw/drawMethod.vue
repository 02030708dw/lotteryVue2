<script>
import drag from '@C/pixi/drag'
import Method from '@C/games/components/Table/Method'
import MethodSB from '../../K3_SB/components/methodSB'
import Container from '@C/pixi/components/Container'
// import * as PIXI from 'pixi.js'

export default {
    name: 'drawMehod',
    beforeMount() {
        this.drawFnFlow.push(
            //全围
            this.drawQuanwei,
            // 围骰
            this.drawWeishai,
            // 雙骰
            this.drawShuangshai,
            // 兩顆骰子(二碼)
            this.drawLiangkeshaizi,
            // 單骰
            this.drawDanshai
        )
        this.resourceArr.push(
            { id: 'dice', file: 'FishShrimpCrab/sp.json' },
            { id: 'fishcomp', file: 'fish_comp/sp.json' },
            { id: 'hoocomp', file: 'hoo_comp/sp.json' },
            { id: 'chickencomp', file: 'chicken_comp/sp.json' },
            { id: 'crabcomp', file: 'crab_comp/sp.json' },
            { id: 'tigercomp', file: 'tiger_comp/sp.json' },
            { id: 'shrimpcomp', file: 'shrimp_comp/sp.json' }
        )
    },
    data() {
        return {
            // 投注使用的獎金tilte
            prizeNameCn: ['鱼', '虾', '胡芦', '虎', '蟹', '鸡']
        }
    },
    methods: {
        // 全围
        drawQuanwei() {
            const style = {
                fontSize: 13,
                fill: '#efd100'
            }
            const points = [
                3, 3,
                3, 230,
                280, 230,
                280, 3
            ]
            const draw = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics.lineStyle(1, lineStyle)
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 283, 234, 10)
                    .endFill()
            }
            const obj = {
                pos: [
                    {x: 497, y: 105, draw: draw, hitArea: new PIXI.Polygon(points)}
                ],
                title: [
                    [
                        { x: 25, y: 59, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'fish' },
                        { x: 70, y: 59, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'fish' },
                        { x: 115, y: 59, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'fish' },
                        { x: 165, y: 59, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'tiger' },
                        { x: 210, y: 59, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'tiger' },
                        { x: 255, y: 59, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'tiger' },
                        { x: 25, y: 125, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'shrimp' },
                        { x: 70, y: 125, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'shrimp' },
                        { x: 115, y: 125, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'shrimp' },
                        { x: 165, y: 125, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'crab' },
                        { x: 210, y: 125, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'crab' },
                        { x: 255, y: 125, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'crab' },
                        { x: 25, y: 191, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'gourd' },
                        { x: 70, y: 191, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'gourd' },
                        { x: 115, y: 191, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'gourd' },
                        { x: 165, y: 191, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'chicken' },
                        { x: 210, y: 191, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'chicken' },
                        { x: 255, y: 191, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'chicken' }
                    ]
                ],
                text: [
                    {x: 140, y: 15, style}
                ]
            }
            this.drawMethod(obj, 'quanwei')
        },
        //围骰
        drawWeishai() {
            const style = {
                fontSize: 13,
                fill: '#efd100'
            }
            const points = [
                3, 3,
                3, 140,
                107, 140,
                107, 3
            ]
            const draw = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 110, 143, 10)
                    .endFill()
            }
            const maxCoin = 10
            const obj = {
                pos: [
                    {x: 140, y: 196, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 259, y: 196, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 378, y: 196, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 788, y: 196, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 907, y: 196, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 1026, y: 196, draw, maxCoin, hitArea: new PIXI.Polygon(points)}
                ],
                title: [
                    [
                        { x: 53, y: 52, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'fish' },
                        { x: 28, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'fish' },
                        { x: 79, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'fish' }
                    ],
                    [
                        { x: 53, y: 52, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'shrimp' },
                        { x: 28, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'shrimp' },
                        { x: 79, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'shrimp' }
                    ],
                    [
                        { x: 53, y: 52, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'gourd' },
                        { x: 28, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'gourd' },
                        { x: 79, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'gourd' }
                    ],
                    [
                        { x: 53, y: 52, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'tiger' },
                        { x: 28, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'tiger' },
                        { x: 79, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'tiger' }
                    ],
                    [
                        { x: 53, y: 52, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'crab' },
                        { x: 28, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'crab' },
                        { x: 79, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'crab' }
                    ],
                    [
                        { x: 53, y: 52, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'chicken' },
                        { x: 28, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'chicken' },
                        { x: 79, y: 104, scale: {x: 0.6, y: 0.6}, id: 'dice', key: 'chicken' }
                    ]
                ],
                text: [
                    {x: 58, y: 13, style},
                    {x: 58, y: 13, style},
                    {x: 58, y: 13, style},
                    {x: 58, y: 13, style},
                    {x: 58, y: 13, style},
                    {x: 58, y: 13, style}
                ]
            }
            this.drawMethod(obj, 'weishai')
        },
        //雙骰
        drawShuangshai() {
            const style = {
                fontSize: 13,
                fill: '#efd100'
            }
            const points = [
                3, 3,
                3, 81,
                107, 81,
                107, 3
            ]
            const points1 = [
                3, 3,
                3, 81,
                107, 81,
                107, 30,
                100, 12,
                81, 3
            ]
            const draw = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 110, 84, 10)
                    .endFill()
            }
            const drawFirst = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics
                    .lineStyle(1, lineStyle)
                    .moveTo(40, 0)
                    .quadraticCurveTo(0, 0, 0, 40)
                    .lineTo(0, 74)
                    .quadraticCurveTo(0, 84, 10, 84)
                    .lineTo(100, 84)
                    .quadraticCurveTo(110, 84, 110, 74)
                    .lineTo(110, 10)
                    .quadraticCurveTo(110, 0, 100, 0)
                    .lineTo(40, 0)
                    .endFill()
            }
            const drawLast = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics
                    .lineStyle(1, lineStyle)
                    .moveTo(10, 0)
                    .quadraticCurveTo(0, 0, 0, 10)
                    .lineTo(0, 74)
                    .quadraticCurveTo(0, 84, 10, 84)
                    .lineTo(100, 84)
                    .quadraticCurveTo(110, 84, 110, 74)
                    .lineTo(110, 40)
                    .quadraticCurveTo(110, 0, 70, 0)
                    .lineTo(10, 0)
                    .endFill()
            }
            const maxCoin = 10
            const obj = {
                pos: [
                    {x: 140, y: 105, draw: drawFirst, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 259, y: 105, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 378, y: 105, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 788, y: 105, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 907, y: 105, draw, maxCoin, hitArea: new PIXI.Polygon(points)},
                    {x: 1026, y: 105, draw: drawLast, maxCoin, hitArea: new PIXI.Polygon(points1)}
                ],
                title: [
                    [
                        { x: 28, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'fish' },
                        { x: 79, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'fish' }
                    ],
                    [
                        { x: 29, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'shrimp' },
                        { x: 77, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'shrimp' }
                    ],
                    [
                        { x: 28, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'gourd' },
                        { x: 79, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'gourd' }
                    ],
                    [
                        { x: 28, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'tiger' },
                        { x: 79, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'tiger' }
                    ],
                    [
                        { x: 28, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'crab' },
                        { x: 79, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'crab' }
                    ],
                    [
                        { x: 28, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'chicken' },
                        { x: 79, y: 56, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'chicken' }
                    ]
                ],
                text: [
                    {x: 58, y: 13, style},
                    {x: 58, y: 13, style},
                    {x: 58, y: 13, style},
                    {x: 58, y: 13, style},
                    {x: 58, y: 13, style},
                    {x: 58, y: 13, style}
                ]
            }
            this.drawMethod(obj, 'shuangshai')
        },

        drawLiangkeshaizi() {
            // 兩顆骰子(二碼)
            // 12 13 14 15 16 23 24 25 26 34 35 36 45 46 56
            const style = {
                fontSize: 14,
                fill: '#efd100'
            }
            const textStyle = { x: 29, y: 11, style }
            const points = [
                3, 3,
                56, 3,
                56, 109,
                3, 109
            ]
            const hitArea = new PIXI.Polygon(points)
            const draw = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 59, 112, 10)
                    .endFill()
            }
            const maxCoin = 10
            const obj = {
                pos: [
                    {x: 140, y: 346, draw, hitArea, maxCoin},
                    {x: 207, y: 346, draw, hitArea, maxCoin},
                    {x: 274, y: 346, draw, hitArea, maxCoin},
                    {x: 341, y: 346, draw, hitArea, maxCoin},
                    {x: 408, y: 346, draw, hitArea, maxCoin},
                    {x: 475, y: 346, draw, hitArea, maxCoin},
                    {x: 543, y: 346, draw, hitArea, maxCoin},
                    {x: 609, y: 346, draw, hitArea, maxCoin},
                    {x: 676, y: 346, draw, hitArea, maxCoin},
                    {x: 745, y: 346, draw, hitArea, maxCoin},
                    {x: 810, y: 346, draw, hitArea, maxCoin},
                    {x: 877, y: 346, draw, hitArea, maxCoin},
                    {x: 944, y: 346, draw, hitArea, maxCoin},
                    {x: 1011, y: 346, draw, hitArea, maxCoin},
                    {x: 1078, y: 346, draw, hitArea, maxCoin}

                ],
                title: [
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'fish' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'shrimp' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'fish' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'gourd' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'fish' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'tiger' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'fish' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'crab' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'fish' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'chicken' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'shrimp' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'gourd' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'shrimp' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'tiger' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'shrimp' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'crab' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'shrimp' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'chicken' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'gourd' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'tiger' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'gourd' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'crab' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'gourd' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'chicken' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'tiger' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'crab' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'tiger' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'chicken' }
                    ],
                    [
                        { x: 27, y: 42, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'crab' },
                        { x: 27, y: 85, scale: {x: 0.55, y: 0.55}, id: 'dice', key: 'chicken' }
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
                ]
            }
            this.drawMethod(obj, 'liangkeshaizi')
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
                ]
            }
            this.drawMethod(obj, 'baozi')
        },
        // 單骰
        drawDanshai () {
            const points = [
                5, 5,
                150, 5,
                150, 102,
                5, 102
            ]
            const pointsFirst = [
                5, 5,
                150, 5,
                150, 102,
                30, 102,
                11, 85,
                5, 66
            ]
            const pointsLast = [
                5, 5,
                150, 5,
                150, 66,
                144, 85,
                120, 102,
                5, 102
            ]
            const hitArea = new PIXI.Polygon(points)
            const hitAreaFirst = new PIXI.Polygon(pointsFirst)
            const hitAreaLast = new PIXI.Polygon(pointsLast)

            // 第一&最後一筆資料是圓角
            const drawFirst = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics
                    .lineStyle(1, lineStyle)
                    .moveTo(10, 0)
                    .quadraticCurveTo(0, 0, 0, 10)
                    .lineTo(0, 61)
                    .quadraticCurveTo(0, 106, 50, 106)
                    .lineTo(144, 106)
                    .quadraticCurveTo(156, 106, 156, 91)
                    .lineTo(156, 10)
                    .quadraticCurveTo(156, 0, 144, 0)
                    .lineTo(10, 0)
            }
            const drawLast = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics
                    .lineStyle(1, lineStyle)
                    .moveTo(10, 0)
                    .quadraticCurveTo(0, 0, 0, 10)
                    .lineTo(0, 91)
                    .quadraticCurveTo(0, 106, 10, 106)
                    .lineTo(104, 106)
                    .quadraticCurveTo(156, 106, 156, 61)
                    .lineTo(156, 10)
                    .quadraticCurveTo(156, 0, 144, 0)
                    .lineTo(10, 0)
            }
            const draw = (Graphics, {lineStyle = 0xffffff, isFill = true}) => {
                Graphics
                    .lineStyle(1, lineStyle)
                    .drawRoundedRect(0, 0, 156, 106, 10)
                    .endFill()
            }

            // 外框
            const pos = Array(6).fill(0).map((item, colIndex) => {
                const isFirst = colIndex === 0
                const isLast = colIndex === 5
                return {
                    x: 140 + colIndex * 168,
                    y: 467,
                    draw: isFirst ? drawFirst : (isLast ? drawLast : draw),
                    hitArea: isFirst ? hitAreaFirst : (isLast ? hitAreaLast : hitArea)
                }
            })

            // 圖示
            // const picArr = [ 'fish', 'shrimp', 'gourd', 'tiger', 'crab', 'chicken' ]
            const titleObj = { x: this.lang === 'us' || this.lang === 'vn' ? 110 : 100, y: 50, scale: {x: 0.95, y: 0.95} }
            const title = [
                // {...titleObj, id: 'dice', key: 'fish'},
                // {...titleObj, id: 'dice', key: 'shrimp'},
                // {...titleObj, id: 'dice', key: 'gourd'},
                // {...titleObj, id: 'dice', key: 'tiger'},
                // {...titleObj, id: 'dice', key: 'crab'},
                // {...titleObj, id: 'dice', key: 'chicken'}
                {...titleObj, id: 'fishcomp', isAnimation: true, animationSpeed: 0.4},
                {...titleObj, id: 'shrimpcomp', isAnimation: true, animationSpeed: 0.4},
                {...titleObj, id: 'hoocomp', isAnimation: true, animationSpeed: 0.4},
                {...titleObj, id: 'tigercomp', isAnimation: true, animationSpeed: 0.4},
                {...titleObj, id: 'crabcomp', isAnimation: true, animationSpeed: 0.4},
                {...titleObj, id: 'chickencomp', isAnimation: true, animationSpeed: 0.4}

            ]
            // 文字
            const text = title.map((item, colIndex) => {
                // 文字樣式
                const titleStyle = {
                    fontSize: 14,
                    fill: '#FFFFFF',
                    fontFamily: 'Microsoft Yahei'
                }
                // 賠率數字樣式
                const prizeStyle = {
                    fontSize: 14,
                    fill: '#efd100'
                }

                const titleData = [{
                    // '单骰'
                    text: 'hhh_t_003',
                    prizeName: `单${this.prizeNameCn[colIndex]}`// 這裡是中文
                }, {
                    // '双骰'
                    text: 'hhh_t_004',
                    prizeName: `双${this.prizeNameCn[colIndex]}`// 這裡是中文
                }, {
                    // '全骰'
                    text: 'hhh_t_005',
                    prizeName: `全${this.prizeNameCn[colIndex]}`// 這裡是中文
                }]

                return titleData.reduce((arr, row, rowIndex) => {
                    const {text, prizeName} = row
                    // 標題(ex:單骰)
                    // isNotPrize: 標記為非賠率文字
                    arr.push({ x: 5, y: 3 + rowIndex * 31, anchor: { x: 0, y: 0 }, style: titleStyle, text: this.$t(text), isNotPrize: true })

                    // 賠率(ex:2.321)
                    arr.push({
                        // 第一欄最後一筆資料碰到轉角要內縮
                        x: (colIndex === 0 && rowIndex === 2) ? 34 : 11,
                        y: 17 + rowIndex * 31,
                        anchor: { x: 0, y: 0 },
                        style: prizeStyle,
                        prizeName
                    })
                    return arr
                }, [])
            })

            const obj = {
                pos,
                title,
                text
            }
            this.drawMethodDanshai(obj)
        },
        // 繪製玩法
        drawMethod({pos, text, title}, dataKey) {
            const p = new Container(this.container, {name: dataKey, sortableChildren: true})
            pos.forEach((options, i) => {
                const method = this[dataKey][i]
                const key = method.key = `${method.methodId}_${method.title}`
                const data = { p, method, ...options }
                this.stopBet[key] && (data.statusCode = 9501)
                this.spritesTemp[key] = new Method(data, text[i], title[i], this.handleClick, this.prize)
                this.spritesNameTemp.push(key)
            })
        },
        // 繪製單骰
        drawMethodDanshai({pos, text, title}) {
            const p = new Container(this.container, {name: 'danshai', sortableChildren: true})
            pos.forEach((options, i) => {
                // 資料跟繪製順序相同
                const method = this.danshai[i]
                const key = method.key = `${method.methodId}_单${method.title}`
                const data = { p, method, ...options }
                this.stopBet[key] && (data.statusCode = 9501)
                this.spritesTemp[key] = new MethodSB(data, text[i], title[i], this.handleClick, this.getPrizeMulti)
                this.spritesNameTemp.push(key)
            })
        }
    },
    computed: {
        // 全部的
        methodArr() {
            return this.gameMenu[0].childs
        },
        // 全圍
        quanwei() {
            return this.methodArr[0].childs
        },
        // 圍骰(豹子)
        weishai() {
            return this.methodArr[1].childs
        },
        // 雙骰
        shuangshai () {
            return this.methodArr[2].childs
        },
        // 單骰(一碼)
        danshai () {
            return this.methodArr[3].childs
        },
        // 兩顆骰子(二碼)
        liangkeshaizi() {
            return this.methodArr[4].childs
        }
    }
}
</script>