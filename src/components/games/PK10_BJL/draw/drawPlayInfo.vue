<script>
import drawPlayInfo from '@C/games/components/Table/draw/drawPlayInfo'
import Graphics from '@C/pixi/components/Graphics'
import Sprite from '@C/pixi/components/Sprite'
import Text from '@C/pixi/components/Text'

export default {
    name: 'PlayInfo_PK10_BJL',
    extends: drawPlayInfo,
    methods: {
        drawPlayInfocontent(p) {
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 22,
                fill: '#fff',
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

            // 置頂說明卡片
            const info = new Graphics(content, {name: 'info', x: 0})
            const textArr = this.$t('baccarat_005').split('<br/>')
            let tempHeight = 10
            textArr.forEach((oneText, idx) => {
                const titleText = new Text({ text: oneText, style: {...style, fontSize: 22}, x: 24, y: tempHeight, p: info, anchor: {x: 0, y: 0} })
                tempHeight += titleText.height + 5
            })

            // 玩法卡片的起始高度
            let y = info.height + 20
            this.howToPlayList.forEach((e, i) => {
                // 分隔線
                const line = new Graphics(content, {x: 24, y: y})
                line
                    .beginFill(0xad8b56)
                    .drawRect(0, 0, content.width - 48, 1)
                    .endFill()

                let list = new Graphics(content, {name: 'list', x: 0})
                const pad = 30

                // 項目符號
                const rectangle = new Graphics(list, {x: 24, y: 29})
                rectangle
                    .beginFill(0xad8b56)
                    .drawRect(0, 0, 10, 10)
                    .endFill()

                const titleText = new Text({ text: e.item_title_show, style: {...style, fontSize: 34}, x: 50, y: 10, p: list, anchor: {x: 0, y: 0} })
                const SubTitleText = new Text({ text: e.sub_title_show, style: {...style, fill: '#ad8b56', fontSize: 18}, x: titleText.width + 55, y: 24, p: list, anchor: {x: 0, y: 0} })
                const contentShow = e.content_show.replace(/\+ /g, '＋')
                const contText = new Text({ text: this.changHtml(contentShow), style, x: 20, y: 60, p: list, anchor: {x: 0, y: 0} })
                if (e.example_show) {
                    const img = new Sprite({ id: 'playInfo', key: 'exampleIcon', x: 20, y: titleText.height + contText.height + pad, p: list })
                    const exTxt = new Text({ text: this.$t('common_018'), style: {...style, fill: '#ad8b56', fontSize: 26}, x: 50, y: titleText.height + contText.height + pad, p: list, anchor: {x: 0, y: 0} })
                    const exContTxt = new Text({ text: this.changHtml(e.example_show), style, x: 20, y: titleText.height + contText.height + exTxt.height + pad + 5, p: list, anchor: {x: 0, y: 0} })
                }
                list.y = y
                y += list.height + 20
            })
            content.height > 470 && this.drawPlayInfoScroll(p, content)
        }
    }
}
</script>