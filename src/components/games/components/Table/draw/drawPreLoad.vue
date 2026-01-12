<script>
import { mapGetters, mapActions } from 'vuex'
import drag from '@C/pixi/drag'
import Container from '@C/pixi/components/Container'
import Graphics from '@C/pixi/components/Graphics'
import Sprite from '@C/pixi/components/Sprite'
import TilingSprite from '@C/pixi/components/TilingSprite'
import Text from '@C/pixi/components/Text'
import BlurFilter from '@C/pixi/filters/BlurFilter'

// import * as PIXI from 'pixi.js'

export default {
    name: 'drawPreLoad',
    beforeMount() {
        this.preResourceArr.push({ id: 'preLoad', file: 'sp.json', urlPath: `${CDN}/static/pixi/share/loading/` })
    },
    methods: {
        drawPreLoadBg() {
            const p = this.preLoad = new Container(this.root, {name: 'preLoad'})
            const { width, height } = this.getScreenSize()
            this.app.view.style.width = width + 'px'
            this.app.view.style.height = height + 'px'
            p.pbg = new TilingSprite({id: 'preLoad', key: 'bg', p, clampMargin: 1})
            const stepPoint = [
                {point: 0, color: '#000'},
                {point: 1, color: '#1c1c1c'}
            ]
            const stepPoint2 = [
                {point: 0, color: '#1c1c1c'},
                {point: 1, color: '#000'}
            ]
            // 寫在此不占記憶體
            const drawTop = (x, y) => {
                let { width, height } = this.getScreenSize()
                if (height > width) {
                    width = height
                    height = 140 * x
                } else {
                    height = 140 * y
                }
                this.preLoad.topShandow.y = -30
                const options = {x1: 0, x2: 0, y1: 0, y2: height, width, height}
                p.topShandow
                    .clear()
                    .beginTextureFill(this.linearGradient(stepPoint, options))
                    .drawRect(0, 0, width, height)
                    .endFill()
            }
            const drawBottom = (x, y) => {
                let { width, height } = this.getScreenSize()
                if (height > width) {
                    width = height
                    height = 140 * x
                } else {
                    height = 140 * y
                }
                this.preLoad.bottomShandow.y = this.preLoad.pbg.height - height + 30
                const options = {x1: 0, x2: 0, y1: 0, y2: height, width, height}
                p.bottomShandow
                    .clear()
                    .beginTextureFill(this.linearGradient(stepPoint2, options))
                    .drawRect(0, 0, width, height)
                    .endFill()
            }
            const filter1 = new BlurFilter({blur: 20, autoFit: true})
            const filter2 = new BlurFilter({blur: 20, autoFit: true})
            p.topShandow = new Graphics(p, {alpha: 0.3, draw: drawTop, filters: [filter1]})
            p.bottomShandow = new Graphics(p, {alpha: 0.3, draw: drawBottom, filters: [filter2]})
            p.middle = new Sprite({id: 'preLoad', key: 'mainImg', p, anchor: {x: 0.5, y: 0.5}})
            p.left = new Sprite({id: 'preLoad', key: 'curtainLeft', p})
            p.right = new Sprite({id: 'preLoad', key: 'curtainLeft', p, scale: {x: -1, y: 1}})
            p.top = new Sprite({id: 'preLoad', key: 'curtainTop', p, anchor: {x: 0.5, y: 0}})

            this.drawProgress()
            this.resizePreLoad()
        },
        drawProgress() {
            // 寫在此不占記憶體
            const draw = () => {
                let {x, y, width, height} = this.preLoad.bar.getBounds()
                const percent = this.preLoad.percentVal / 100
                if (width > height) {
                    width *= percent
                } else {
                    height *= percent
                }
                this.preLoad.maskG
                    .clear()
                    .beginFill(0xff0000)
                    .drawRect(x, y, width, height)
                    .endFill()
            }
            const mask = this.preLoad.maskG = new PIXI.Graphics()
            const p = this.preLoad
            this.preLoad.barBg = new Sprite({id: 'preLoad', key: 'loadingBarBg', p, anchor: {x: 0.5, y: 1}})
            this.preLoad.bar = new Container(this.preLoad, {mask, draw})
            const bar = new Sprite({id: 'preLoad', key: 'loadingBar', p: this.preLoad.bar, anchor: {x: 0.5, y: 0}})
            const style = {
                fill: 0xffffff,
                fontSize: 32,
                fontFamily: 'Microsoft Yahei',
                fontWeight: 'bold',
                stroke: 0x000000,
                strokeThickness: 2
            }
            // 檔案路徑及名字
            // const style2 = {
            //     fill: 0xffffff,
            //     fontSize: 12,
            //     fontFamily: 'Microsoft Yahei',
            //     fontWeight: 'bold',
            //     stroke: 0x000000,
            //     strokeThickness: 2
            // }
            this.preLoad.text = new Container(this.preLoad, {name: 'preLoadText'})
            // 游戏载入中
            p.string = new Text({text: this.$t('table_011'), p: p.text, anchor: {x: 0, y: 0}, style})
            p.percent = new Text({text: '0%', p: p.text, anchor: {x: 0, y: 0}, style})
            // p.fileName = new Text({text: '123', p: bar, anchor: {x: 0.5, y: 0}, style: style2})
        },
        resizePreLoad() {
            const bg = this.preLoad.pbg
            const m = this.preLoad.middle
            const l = this.preLoad.left
            const r = this.preLoad.right
            const t = this.preLoad.top
            const bb = this.preLoad.barBg
            const b = this.preLoad.bar
            const text = this.preLoad.text
            const stage = this.app.stage
            const { width, height } = this.getScreenSize()
            const widthR = 1280
            const heightR = 720

            const wratio = width / height
            const ratio = widthR / heightR
            const vatio = height / width
            let x, y, cx, cy, cw, ch
            if (width >= height) {
                // PIXI.isTest = false
                stage.rotation = 0
                stage.x = 0
                if (wratio < ratio) {
                    x = width / widthR
                    y = width / ratio / heightR
                } else {
                    x = height * ratio / widthR
                    y = height / heightR
                }
                cw = width
                ch = height
                text.children.forEach(t => (t.style.fontSize = 32 * x))
            } else {
                // PIXI.isTest = true
                stage.rotation = Math.PI / 2
                stage.x = width
                if (vatio < ratio) {
                    x = height / widthR
                    y = height / ratio / heightR
                } else {
                    x = width * ratio / widthR
                    y = width / heightR
                }
                cw = height
                ch = width
                text.children.forEach(t => (t.style.fontSize = 32 * y))
            }
            m.scale = {x, y}
            l.scale = {x, y}
            r.scale = {x: -x, y}
            t.scale = {x, y}
            b.scale = {x, y}
            bb.scale = {x, y}

            cx = cw / 2
            cy = ch / 2
            m.x = cx
            m.y = cy
            r.x = cw
            t.x = cx
            b.x = cx
            bb.x = cx
            bb.y = ch - 25 * x
            b.y = bb.y - bb.height + 8.5 * x
            text.children[1].x = text.children[0].width + 10
            text.x = cx - ((text.children[0].width + text.children[1].width + 15) / 2)
            text.y = bb.y - bb.height * 2
            bg.width = cw
            bg.height = ch
            this.preLoad.topShandow.draw(x, y)
            this.preLoad.bottomShandow.draw(x, y)
            this.preLoad.bar.draw()
            this.app.view.style.width = width + 'px'
            this.app.view.style.height = height + 'px'
            this.app.renderer.resize(width, height)
        }
    }
}
</script>