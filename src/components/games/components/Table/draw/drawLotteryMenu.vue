<script>
import drag from '@C/pixi/drag'
import Container from '@C/pixi/components/Container'
import ButtonMixin from '@C/pixi/components/ButtonMixin'
import Graphics from '@C/pixi/components/Graphics'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Text from '@C/pixi/components/Text'

import Scrollbox from '@C/pixi/components/Scrollbox'
import { Storage } from '@API'
import {setStorage, getStorage, returnState} from '@UTIL'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'drawLotteryMenu',
    beforeMount() {
        this.resourceArr.push(
            { id: 'lotteryMenuArrow', file: 'lotteryMenuList/lotteryMenuArrow.png', urlPath: `${CDN}/static/pixi/share/` }
        )

        // this.drawFnFlow.push(this.drawLotteryMenu)
    },
    data() {
        return {
            lotteryMenuScrol: {},
            lotteryMenuScrol2: {},
            lotteryMenuScrol3: {},
            menuIdData: '1',
            subMenuKeyData: 'SSC',
            lotteryListPaddingW: 10,
            lotteryListRowH: 68,
            lotteryListRowHalfH: 34.5
        }
    },
    computed: {
        ...mapGetters([
            'lotteryMenuData',
            'lotteryList2',
            'officialKeyVN',
            'lotteryListLocalVN',
            'lotteryOfficialVN',
            'globalLottery',
            'VN_hasOld',
            'gameRoutePath'
        ]),
        ...mapGetters({
            lotteryMenuConfig: 'lotteryMenu'
        }),
        menuId: {
            get() {
                return this.menuIdData
            },
            set(val) {
                this.menuIdData = val
                this.lotteryMenuScrol2.destroy()
                this.subMenuKey = this.subTabData[0][0]
                this.drawLotteryMenuScroll2()
            }
        },
        subMenuKey: {
            get() {
                return this.subMenuKeyData
            },
            set(val) {
                this.subMenuKeyData = val
                this.lotteryMenuScrol3.destroy()
                this.drawLotteryMenuScroll3()
            }
        },
        subTabData() {
            if (+this.menuId === 3) {
                return [['vn', {title_key: 'lottery_menu_type_3'}]]
            } else if (+this.menuId === 6) {
                return [['th', {title_key: 'lottery_menu_type_6'}]]
            }
            return Object.entries((this.lotteryMenuConfig[this.menuId] || {}).list || {})
        },
        lotteryListStyle() {
            return {
                fill: '#ffffff',
                fontSize: 24,
                fontFamily: '微软正黑体'
            }
        },
        lotteryListStyle2() {
            return {
                fill: '#ffcc01',
                fontSize: 24,
                fontFamily: '微软正黑体'
            }
        },
        gameMenuList() {
            let list = []
            const data = (this.lotteryMenuConfig[this.menuId] || {}).list || {}
            let listData = []
            const vnKey = {
                VN_S: '163',
                VN_C: '183',
                VN_N: '197',
                VN_ALL: '162'
            }
            if ([3].includes(+this.menuId)) {
                Object.values(this.lotteryListLocalVN)
                    .forEach(obj => {
                        listData.push(this.lotteryList2[obj.lottery])
                    })
                // 全區 官彩
                const isShowAllArea = this.officialKeyVN.find(pos => this.lotteryOfficialVN[pos]) && this.VN_hasOld
                isShowAllArea && listData.push({
                    is_local: false,
                    lottery: '162',
                    menuId: 3
                })
                // 官方彩
                Object
                    .entries(data)
                    .filter(([lotName]) => this.officialKeyVN.includes(lotName))
                    .forEach(([lotName, val]) => {
                        // 官方彩
                        listData.push({
                            lottery: vnKey[lotName],
                            menuId: 3,
                            name: lotName
                        })
                    })
            } else if ([6].includes(+this.menuId)) {
                Object
                    .entries(data)
                    .forEach(([, obj]) => {
                        (obj.childs || []).forEach((obj) => {
                            listData.push(obj)
                        })
                    })
            } else {
                listData = (data[this.subMenuKey] || {}).childs || []
            }
            const pushlist = (items) => {
                list.push({
                    ...items,
                    class: items.function_type,
                    router: `/${this.gameRoutePath[items.menuId]}/${items.lottery}`
                })
            }
            const thPushList = items => pushlist({...items, function_type: 'TH', class2: items.function_type})
            const vnPushList = (items) => {
                const officialId = [162, 163, 183, 197]
                if (officialId.includes(+items.lottery)) {
                    if (+items.lottery !== 162) {
                        const p = {
                            VN_S: 1,
                            VN_C: 2,
                            VN_N: 3
                        }
                        const title = {
                            VN_S: 'lottery_functionType_VN_S',
                            VN_C: 'lottery_functionType_VN_C',
                            VN_N: 'lottery_functionType_VN_N'
                        }
                        list.push({
                            class: 'VIETNAM',
                            lotteryId: items.lottery,
                            lottery: 'vietnam',
                            function_type: items.name,
                            title_key: title[items.name],
                            router: `/GamePlayerVN?p=${p[items.name]}`
                        })
                    } else {
                        const isShowAllArea = this.officialKeyVN.find(pos => this.lotteryOfficialVN[pos]) && this.VN_hasOld
                        isShowAllArea && list.push({
                            is_local: false,
                            class: 'VIETNAM',
                            lotteryId: '162',
                            lottery: 'vietnam',
                            function_type: 'VN_ALL',
                            title_key: 'vn_t_001',
                            router: {name: 'GamePlayerVN', query: {p: 0, l: undefined}}
                        })
                    }
                } else {
                    list.push({
                        ...items,
                        class: 'VIETNAM',
                        lotteryId: items.lottery,
                        router: `/GamePlayerVN?p=1&l=${items.lottery}`
                    })
                }
            }
            const routerFn = {
                1: pushlist,
                2: pushlist,
                3: vnPushList,
                4: pushlist,
                5: pushlist,
                6: thPushList,
                7: pushlist,
                8: pushlist,
                9: pushlist,
                10: pushlist
            }
            listData.forEach((item) => {
                const { menuId = 3 } = this.lotteryList2[item.lottery] || {}
                routerFn[menuId].call(this, {...item, menuId})
            })
            return list
        }
    },
    methods: {
        // 繪製設定彈窗
        drawLotteryMenu() {
            // 設定彈窗整個區塊
            const menuWidth = 1000
            const menuHeight = 600
            this.lotteryMenu = new Container(this.front, { name: 'lotteryMenu', x: (1280 - menuWidth) / 2, y: (720 - menuHeight) / 2 + 25 })
            this.lotteryMenu.interactive = true
            this.forceUpdateLottery()
            const fn = () => this.lotteryMenu.destroy({children: true})
            this.mask.show({name: 'lotteryMenu'}, fn)
            this.drawLotteryMenuBg(menuWidth, menuHeight)
            this.drawLotteryMenuCloseBtn()
            this.drawLotteryMenuTitle()
            this.drawLotteryMenuBg2(menuWidth, menuHeight)
            this.drawLotteryMenuScroll1()
            this.drawLotteryMenuScroll2()
            this.drawLotteryMenuScroll3()
        },
        // 彩種選單
        drawLotteryMenuBg(width, height) {
            this.lotteryMenu.bg = new Graphics(this.lotteryMenu, {name: 'menuBorder'})

            this.lotteryMenu.bg
                .lineStyle(6, 0x2c2c2c)
                .beginFill(0x191919)
                .drawRoundedRect(0, 0, width, height, 30)
                .endFill()
        },
        // 關閉按鈕
        drawLotteryMenuCloseBtn() {
            const closeBtn = new Button({ id: 'setting', key: 'close', x: 988, anchor: {x: 0.5, y: 0.5}, p: this.lotteryMenu.bg }, {
                down: { scale: { x: 0.9, y: 0.9 } },
                up: {
                    scale: { x: 1, y: 1 },
                    fn: () => {
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        // reset音效設定
                        // this.userConfig = { ...this.userConfig, ...getStorage(Storage.tableSoundConfig) }
                        this.mask.hide({name: 'lotteryMenu'})
                    }
                },
                out: {
                    scale: { x: 1, y: 1 }
                }
            })
        },
        // 彈窗標題
        drawLotteryMenuTitle() {
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 32,
                fontWeight: 'bold',
                fill: '#ffffff'
            }
            const title = new Text({ name: 'mainTitle', text: this.$t('home_007'), style, x: 0, y: 13, p: this.lotteryMenu.bg, anchor: {x: 0, y: 0} })
            title.x = (this.lotteryMenu.width - title.width) / 2
        },
        // 彩種選單
        drawLotteryMenuBg2(width, height) {
            const diffWidth = 60
            const diffHeight = 120
            const x = diffWidth / 2
            const y = diffHeight / 2
            const trueWidth = width - diffWidth
            const trueHeight = height - diffHeight
            this.lotteryMenu.bg2 = new Graphics(this.lotteryMenu, {name: 'menuBorder'})

            this.lotteryMenu.bg2
                .lineStyle(3, 0x1e1e1e)
                .beginFill(0x262626)
                .drawRoundedRect(x, y, trueWidth, trueHeight, 10)
                .endFill()
                .lineStyle(1, 0x3c3c3c)
                .moveTo(x + 280, y)
                .lineTo(x + 280, 475 + y)
                .moveTo(x + 560, y)
                .lineTo(x + 560, 475 + y)
        },
        // 彩種選單
        drawLotteryMenuScroll1() {
            this.lotteryMenuScrol = new Container(this.lotteryMenu, { name: 'lotteryMenu', x: 35, y: 63, width: 280, height: 475 })
            const scrollBox = this.lotteryMenuScrol.scrollBox = new Scrollbox({
                boxWidth: 280,
                boxHeight: 475,
                scrollbarSize: 6,
                scrollbarBackgroundAlpha: 0,
                scrollbarForeground: 0xffffff,
                scrollbarForegroundAlpha: 0.2,
                scrollbarOffsetHorizontal: -10,
                scrollbarOffsetVertical: -10
            })
            let viewport = this.lotteryMenuScrol
            if (this.lotteryMenuData.length > 7) {
                this.lotteryMenuScrol.addChild(scrollBox)
                viewport = scrollBox.content
                // 讓scrollBox 鎖定好區域而不跑掉
                const fakeArea = new Graphics(viewport, {name: 'fakeArea'})
                fakeArea
                    .beginFill(0x000000)
                    .drawRect(0, 0, 280, 0)
                    .endFill()
            }
            // 箭頭的Y座標
            let arrowY = 0
            // 畫出列表
            let menuData = this.lotteryMenuData.map(({title_key, menuType}, i) => {
                const y = (i + 0.5) * this.lotteryListRowH
                const menuBtn = new ButtonMixin(viewport,
                    { x: this.lotteryListPaddingW, y },
                    {
                        down: { fn: () => {
                            menuData.forEach(({menuText}) => {
                                menuText.style = this.lotteryListStyle
                            })
                        }},
                        up: { fn: () => {
                            menuText.style = this.lotteryListStyle2
                            arrow.y = y
                            this.menuId = menuType
                        }},
                        out: { fn: () => {
                            menuText.style = this.lotteryListStyle
                        }}
                    }
                )
                if (this.lotteryMenuData.length !== i + 1) {
                    const line = new Graphics(viewport, { x: this.lotteryListPaddingW - 5, y: y + this.lotteryListRowHalfH })
                    line
                        .lineStyle(1, 0x3c3c3c)
                        .lineTo(260, 0)
                }
                menuBtn
                    .beginFill(0x262626)
                    .drawRect(0, -this.lotteryListRowHalfH + 5, 260, this.lotteryListRowH - 5)
                    .endFill()
                const menuText = new Text({ text: this.$t(title_key), style: this.lotteryListStyle, p: menuBtn, anchor: { x: 0, y: 0.5 } })
                if (this.menuId === +menuType) {
                    arrowY = y
                    menuText.style = this.lotteryListStyle2
                }
                return { menuBtn, menuText }
            })
            const arrow = new Sprite({ id: 'lotteryMenuArrow', x: 240, y: arrowY, p: viewport, anchor: { x: 0, y: 0.5 } })
            this.lotteryMenuScrol.scrollBox && this.lotteryMenuScrol.scrollBox.update()
        },
        // 彩種選單
        drawLotteryMenuScroll2() {
            this.lotteryMenuScrol2 = new Graphics(this.lotteryMenu, { name: 'lotteryMenu', x: 315, y: 63 })
            let viewport = this.lotteryMenuScrol2
            if (this.subTabData.length > 7) {
                const scrollBox = this.lotteryMenuScrol2.scrollBox = new Scrollbox({
                    boxWidth: 280,
                    boxHeight: 475,
                    scrollbarSize: 6,
                    scrollbarBackgroundAlpha: 0,
                    scrollbarForeground: 0xffffff,
                    scrollbarForegroundAlpha: 0.2
                })
                this.lotteryMenuScrol2.addChild(scrollBox)
                viewport = scrollBox.content
                const fakeArea = new Graphics(viewport, {name: 'fakeArea'})
                fakeArea
                    .beginFill(0x000000)
                    .drawRect(0, 0, 280, 0)
                    .endFill()
            }
            // 箭頭的Y座標
            let arrowY = 0
            // 畫出列表
            let menuData = this.subTabData.map(([key, {title_key}], i) => {
                const y = (i + 0.5) * this.lotteryListRowH
                const menuBtn = new ButtonMixin(viewport,
                    { x: this.lotteryListPaddingW, y },
                    {
                        down: { fn: () => {
                            menuData.forEach(({menuText}) => {
                                menuText.style = this.lotteryListStyle
                            })
                        }},
                        up: { fn: () => {
                            menuText.style = this.lotteryListStyle2
                            arrow.y = y
                            this.subMenuKey = key
                        }},
                        out: { fn: () => {
                            menuText.style = this.lotteryListStyle
                        }}
                    }
                )
                if (this.subTabData.length !== i + 1) {
                    const line = new Graphics(viewport, { x: this.lotteryListPaddingW - 5, y: y + this.lotteryListRowHalfH })
                    line
                        .lineStyle(1, 0x3c3c3c)
                        .lineTo(260, 0)
                }
                menuBtn
                    .beginFill(0x262626)
                    .drawRect(0, -this.lotteryListRowHalfH + 5, 260, this.lotteryListRowH - 5)
                    .endFill()
                const menuText = new Text({ text: this.$t(title_key), style: this.lotteryListStyle, p: menuBtn, anchor: { x: 0, y: 0.5 } })
                if (key === this.subMenuKey) {
                    arrowY = y
                    menuText.style = this.lotteryListStyle2
                }
                return { menuBtn, menuText }
            })
            const arrow = new Sprite({ id: 'lotteryMenuArrow', x: 240, y: arrowY, p: viewport, anchor: { x: 0, y: 0.5 } })
            this.lotteryMenuScrol2.scrollBox && this.lotteryMenuScrol2.scrollBox.update()
        },
        // 彩種選單
        drawLotteryMenuScroll3() {
            this.lotteryMenuScrol3 = new Container(this.lotteryMenu, { name: 'lotteryMenu', x: 595, y: 63 })
            let viewport = this.lotteryMenuScrol3
            if (this.gameMenuList.length > 7) {
                const scrollBox = this.lotteryMenuScrol3.scrollBox = new Scrollbox({
                    boxWidth: 375,
                    boxHeight: 475,
                    scrollbarSize: 6,
                    scrollbarBackgroundAlpha: 0,
                    scrollbarForeground: 0xffffff,
                    scrollbarForegroundAlpha: 0.2
                })
                this.lotteryMenuScrol3.addChild(scrollBox)
                viewport = scrollBox.content
                const fakeArea = new Graphics(viewport, {name: 'fakeArea'})
                fakeArea
                    .beginFill(0x000000)
                    .drawRect(0, 0, 375, 0)
                    .endFill()
                scrollBox.update()
            }
            let menuData = this.gameMenuList.map(({title_key, router, lotteryId, lottery}, i) => {
                const y = (i + 0.5) * this.lotteryListRowH
                const menuBtn = new ButtonMixin(viewport,
                    { x: this.lotteryListPaddingW, y },
                    {
                        down: { fn: () => {
                            menuText.style = this.lotteryListStyle2
                        }},
                        up: { fn: () => {
                            menuText.style = this.lotteryListStyle
                            this.mask.hide({name: 'lotteryMenu'})
                            this.handleRoute(router, lotteryId || lottery)
                        }},
                        out: { fn: () => {
                            menuText.style = this.lotteryListStyle
                        }}
                    }
                )
                menuBtn
                    .beginFill(0x262626)
                    .drawRect(0, -this.lotteryListRowHalfH + 5, 360, this.lotteryListRowH - 5)
                    .endFill()
                if (this.gameMenuList.length !== i + 1) {
                    const line = new Graphics(viewport, { x: this.lotteryListPaddingW - 5, y: y + this.lotteryListRowHalfH })
                    line
                        .lineStyle(1, 0x3c3c3c)
                        .lineTo(360, 0)
                }
                const menuText = new Text({ text: this.$t(title_key), style: this.lotteryListStyle, p: menuBtn, anchor: { x: 0, y: 0.5 } })
                if (+this.lotteryId === +(lotteryId || lottery)) {
                    menuText.style = this.lotteryListStyle2
                }
                return { menuBtn, menuText }
            })
            this.lotteryMenuScrol3.scrollBox && this.lotteryMenuScrol3.scrollBox.update()
        },
        handleRoute(router, lottery) {
            this[_M.SET_POP_ACTIVE]({gameHamburger: false})
            const bodyNoScroll = document.body.classList
            bodyNoScroll.remove('bodyNoScroll')
            this.$router.push(router || `/GamePlayer/${lottery}`)
        },
        forceUpdateLottery() {
            const { menuId, name } = this.globalLottery
            this.menuIdData = menuId
            this.subMenuKeyData = name
        }
    }
}
</script>
