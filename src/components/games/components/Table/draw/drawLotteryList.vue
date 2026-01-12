<script>
import drag from '@C/pixi/drag'
import Container from '@C/pixi/components/Container'
import Scrollbox from '@C/pixi/components/Scrollbox'
import Graphics from '@C/pixi/components/Graphics'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Text from '@C/pixi/components/Text'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'drawLotteryList',
    // beforeMount() {
    //     this.resourceArr.push(
    //         { id: 'setting', file: 'sp.json', urlPath: `${CDN}/static/pixi/share/setting/` }
    //     )
    // },
    data() {
        return {
            lotteryListContainer: {}
        }
    },
    computed: {
        ...mapGetters([
            'lang'
            // 'getLangObj'
        ])
        // 取得有開放的語言
    },
    methods: {
        ...mapActions([
            // _M.SET_LANG
        ]),
        closeWindow() {
            this.mask.hide()
            this.lotteryListContainer.destroy({children: true})
        },
        drawLotteryList() {
            const container = new Container(this.front, {name: 'playInfo', scale: { x: 0.9, y: 0.9 }})
            const bg = new Sprite({ id: 'playInfo', key: 'bg', x: 223, y: 28, p: container })
            const closeBtn = new Button({ id: 'playInfo', key: 'X', x: 734, y: 60, anchor: {x: 0.5, y: 0.5}, p: bg }, {
                down: { textureID: 'X', scale: { x: 0.9, y: 0.9 } },
                up: {
                    textureID: 'X',
                    scale: { x: 1, y: 1 },
                    fn: () => {
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        this.mask.hide({name: 'playInfo'})
                    }
                },
                out: {
                    scale: { x: 1, y: 1 }
                }
            })
            const fn = () => container.destroy({children: true})
            this.mask.show({name: 'playInfo'}, fn)
            // drag(closeBtn)

            this.drawLotteryListTitle(bg)
            this.drawLotteryListcontent(bg)
            TweenMax.to(container.scale, 0.2, {x: 1, y: 1})
        },
        drawLotteryListTitle(p) {
            const content = new Container(p, {name: 'title', y: 42})
            //const icon = new Sprite({ id: 'playInfo', key: 'icon', x: 0, y: 0, p: content})
            let style = {
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
                // dropShadowDistance: 2
            }
            const title = new Text({ text: this.$t('home_013'), style, x: 0, y: 30, p: content, anchor: {x: 0, y: 0} })
            content.x = 400 - (content.width / 2)
        },
        drawLotteryListScroll(p, child) {
            child.x = 0
            child.y = 0
            const scrollbox = new Scrollbox({
                boxWidth: 570,
                boxHeight: 470,
                scrollbarBackgroundAlpha: 0,
                scrollbarForeground: 0x000000,
                scrollbarForegroundAlpha: 0.2
            })
            scrollbox.position.set(113, 125)
            p.addChild(scrollbox)
            scrollbox.content.addChild(child)
            scrollbox.content.cacheBitmapAsBitmap = true
            scrollbox.update()
        },
        drawLotteryListcontent(p) {
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 22,
                fill: '#fff',
                // stroke: '#054349',
                // strokeThickness: 2,
                fontWeight: 'bold',
                breakWords: true,
                wordWrap: true,
                wordWrapWidth: 530,
                lineHeight: 35
            }
            const content = new Graphics(p, {name: 'playInfoContent', x: 115, y: 120})
            content
                .beginFill(0x000000)
                .drawRect(0, 0, 570, 0)
                .endFill()
            let y = 0
            this.howToPlayList.forEach((e, i) => {
                console.log(e)
                const contentShow = e.content_show.replace(/\+ /g, '＋')
                let list = new Graphics(content, {name: 'list', x: 0})
                const pad = 30
                const rectangle = new Graphics(list, {x: 24, y: 29})
                rectangle
                    .beginFill(0xad8b56)
                    .drawRect(0, 0, 10, 10)
                    .endFill()
                const titleText = new Text({ text: e.item_title_show, style: {...style, fontSize: 34}, x: 50, y: 10, p: list, anchor: {x: 0, y: 0} })
                const contText = new Text({ text: this.changHtml(contentShow), style, x: 20, y: 60, p: list, anchor: {x: 0, y: 0} })
                if (e.example_show) {
                    const img = new Sprite({ id: 'playInfo', key: 'exampleIcon', x: 20, y: titleText.height + contText.height + pad, p: list })
                    const exTxt = new Text({ text: this.$t('common_018'), style: {...style, fill: '#ad8b56', fontSize: 26}, x: 50, y: titleText.height + contText.height + pad, p: list, anchor: {x: 0, y: 0} })
                    const exContTxt = new Text({ text: this.changHtml(e.example_show), style, x: 20, y: titleText.height + contText.height + exTxt.height + pad + 5, p: list, anchor: {x: 0, y: 0} })
                    if (i !== this.howToPlayList.length - 1) {
                        const line = new Graphics(list, {x: 24, y: titleText.height + contText.height + exTxt.height + exContTxt.height + pad * 2})
                        line
                            .beginFill(0xad8b56)
                            .drawRect(0, 0, content.width - 48, 1)
                            .endFill()
                    }
                } else {
                    if (i !== this.howToPlayList.length - 1) {
                        const line = new Graphics(list, {x: 24, y: titleText.height + contText.height + pad * 1.5})
                        line
                            .beginFill(0xad8b56)
                            .drawRect(0, 0, content.width - 48, 1)
                            .endFill()
                    }
                }
                list.y = y
                y += list.height + 20
            })
            content.height > 470 && this.drawLotteryListScroll(p, content)
        },
        async getHowToPlay() {
            await this[_M.GET_PLAYINFO_NEW_LIST]({
                langShow: this.lang,
                functionType: this.gameType
            })
            this.setHowToPlay()
        },
        setHowToPlay() {
            const data = this.gameTablePlayInfoList[this.gameType]
            for (var item in data) {
                let subData = data[item].childs
                subData.forEach((key, i) => this.howToPlayList.push(key))
            }
            // console.log(this.howToPlayList)
        },
        changHtml(txt) {
            return txt.replace(/<br\/>/g, '\n')
        }
    }
}
</script>