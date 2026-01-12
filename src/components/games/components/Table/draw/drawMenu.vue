<script>
import drag from '@C/pixi/drag'
import Button from '@C/pixi/components/Button'
import ButtonMixin from '@C/pixi/components/ButtonMixin'
import Sprite from '@C/pixi/components/Sprite'
import Container from '@C/pixi/components/Container'
import Text from '@C/pixi/components/Text'
import Graphics from '@C/pixi/components/Graphics'
import drawSetting from './drawSetting'
import drawLotteryMenu from './drawLotteryMenu'

import { warnMessageBox } from '@UTIL'
import { mapActions, mapGetters } from 'vuex'
// import * as PIXI from 'pixi.js'

export default {
    name: 'drawMenu',
    mixins: [drawSetting, drawLotteryMenu],
    data() {
        return {
            // 没有提供onClick时, 预设为导航至path页面
            menuArr: [
                {key: 'home', name: 'home_051', path: '/'}, // 首页大厅
                // 游戏清单
                {key: 'lotteryMenu',
                    name: 'home_007',
                    onClick: this.drawLotteryMenu
                },
                // 我的最愛
                // {key: 'myFavorite',
                //     name: 'home_053',
                //     onClick: this.drawLotteryMenu
                // },
                // {key: 'howToPlay', name: 'home_013', path: '/PlayInfo/4'}, // 投注记录
                {key: 'bettingRecord', name: 'home_009', path: '/GameInfo'}, // 投注记录
                {key: 'winLose', name: 'home_062', path: '/WinLose'}, // 输赢报表(要换ICON)
                // {key: 'tracingRecord', name: 'home_010', path: '/AddNewGameInfo'}, // 追号记录
                {key: 'profitAndLoss', name: 'home_011', path: '/ReportList'}, // 盈亏查询
                {key: 'walletRecord', name: 'home_012', path: '/Wallet'}, // 钱包记录
                // 名人榜
                {key: 'celebrityList',
                    name: 'celebrity_001',
                    path: '/',
                    onClick: () => {
                        this[_M.SET_POP_ACTIVE]({scoreBoard: !this.isScoreBoardShow})
                        this.$msg({
                            useOldPop: true,
                            show: true,
                            zIndex: 1992,
                            isOutSideClickClose: true,
                            isCustom: true
                        })
                    }},
                // 设置
                {key: 'setting',
                    name: 'Glory_0021',
                    onClick: this.drawSetting
                }
            ],
            isVsible: false,
            isSetFavoriting: false
        }
    },
    beforeMount() {
        this.drawFnFlow.push(
            this.dragMenuBtn
        )
        this.resourceArr.push(
            { id: 'menu', file: 'menu/sp_v2.json', urlPath: `${CDN}/static/pixi/share/` }
        )

        // 检查菜单显示权限
        this.menuArr = this.menuArr.filter((meunObj) => {
            const {key} = meunObj
            // 名人榜
            if (key === 'celebrityList' && !this.isShowScoreBoard) {
                return false
            }
            return true
        })
    },
    computed: {
        ...mapGetters([
            'myFavorites'
        ]),
        isShowScoreBoard() {
            return !!RmUserInfo.enableLeaderBoard
        },
        isInFavorites() {
            return this.myFavorites.includes(this.lotteryId)
        },
        favouriteKey() {
            return this.isInFavorites ? 'favourite2' : 'favourite'
        }
    },
    methods: {
        ...mapActions([
            _M.SET_POP_ACTIVE,
            _M.SET_MY_FAVORITES
        ]),
        dragMenuBtn() {
            const p = new Container(this.container, {name: 'MenuBtn'})
            const menuBtn = new Button({ id: 'btn', key: 'lm', x: 1200, y: 22, p }, {
                up: {
                    fn: () => {
                        const hideFn = () => {
                            this.isVsible = false
                            this.menuTween.kill()
                            this.menuTween = TweenMax
                                .to(this.menu, 0.2, {x: 1280 + this.menu.maxWidth})
                                .eventCallback('onComplete', () => {
                                    this.menu.destroy({children: true})
                                    p.addChild(menuBtn)
                                })
                            menuBtn.setTextureKey('lm')
                        }
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        this.isVsible = !this.isVsible
                        if (this.isVsible) {
                            this.drawMenu(menuBtn)
                            this.front.addChild(menuBtn)
                            this.mask.show(menuBtn, hideFn)
                            menuBtn.setTextureKey('bmc')
                        } else {
                            this.mask.hide(menuBtn)
                        }
                    }
                }
            })
            // this.drawMenu()
            const playInfoBtn = new Button({ id: 'btn', key: 'question', x: 1200, y: 105, p }, {
                down: { textureID: 'questionc' },
                up: {
                    textureID: 'question',
                    fn: () => {
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        this.drawPlayInfo()
                    }
                },
                out: {
                    textureID: 'question'
                }
            })
            const favouriteBtn = new Button({ id: 'btn', key: this.favouriteKey, x: 1200, y: 188, p }, {
                down: { fn: () => favouriteBtn.setTextureKey(`${this.favouriteKey}c`) },
                up: {
                    fn: async () => {
                        if (!this.isSetFavoriting) {
                            this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                            this.isSetFavoriting = true
                            let data, tipTxt
                            if (this.isInFavorites) {
                                data = this.myFavorites.filter(id => id !== this.lotteryId)
                                // '已取消最爱'
                                tipTxt = 'common_135'
                            } else if (this.myFavorites.length >= 30) {
                                // '最多30个最爱彩种'
                                tipTxt = 'home_043'
                            } else {
                                data = [...this.myFavorites, this.lotteryId]
                                // '已加入最爱'
                                tipTxt = 'common_136'
                            }
                            const isNotError = data ? await this[_M.SET_MY_FAVORITES](data) : true
                            this.setFavoritingTimer = setTimeout(() => (this.isSetFavoriting = false), 500)
                            if (isNotError) {
                                favouriteBtn.setTextureKey(this.favouriteKey)
                                if (this.isEraser) {
                                    this.showTipChange(tipTxt, 'Glory_3001')
                                } else {
                                    this.showTip(tipTxt)
                                }
                            } else {
                                this.$msg(warnMessageBox({
                                    // '系统繁忙中，请再试一次。'
                                    message: this.$t('popup_098')
                                }))
                            }
                        }
                    }
                },
                out: { fn: () => favouriteBtn.setTextureKey(this.favouriteKey) }
            })
        },
        drawMenu(btn) {
            const paddingW = 35 // 两边宽距
            const rowH = 72 // 行高
            const iconMarginLeft = 20 // icon 距离左边之距离
            const iconMarginRight = 65 // icon 距离右边之距离
            const marginRight = 10 // 选单距离画布右边之距离
            const marginTop = 108 // 选单距离画布上面之距离
            const p = this.menu = new Container(this.front, { name: 'Menu', y: marginTop, paddingW, rowH })
            const style = {
                fill: '#ffffff',
                fontSize: 32,
                fontFamily: '微软正黑体'
            }
            const style2 = {
                fill: '#efd100',
                fontSize: 32,
                fontFamily: '微软正黑体'
            }
            this.menu.bg = new Graphics(this.menu, {name: 'menuBorder', alpha: 0.9})
            this.menuArea = []
            this.menuBtn = this.menuArr.map(({key, name, path, onClick}, i) => {
                const y = (i + 0.5) * rowH
                const menuBtn = new ButtonMixin(p,
                    { x: paddingW, y },
                    {
                        down: { fn: () => {
                            icon.tint = 0xefd100
                            menuText.style = style2
                        }},
                        up: { fn: () => {
                            icon.tint = 0xffffff
                            menuText.style = style
                            if (onClick) {
                                // 关闭侧边菜单
                                btn.fnData.up.fn()
                                onClick()
                            } else {
                                this.$router.push(path)
                            }
                        }},
                        out: { fn: () => {
                            icon.tint = 0xffffff
                            menuText.style = style
                        }}
                    }
                )
                const icon = new Sprite({ id: 'menu', key, x: iconMarginLeft, p: menuBtn, anchor: { x: 0.5, y: 0.5 } })
                const menuText = new Text({ text: this.$t(name), x: iconMarginRight, style, p: menuBtn, anchor: { x: 0, y: 0.5 } })
                this.menuArea[i] = new Graphics(menuBtn, {alpha: 0, x: -32, y: -42})
                // console.lgo(Math.max(menuBtn.parent.map(btn => btn.width)) + paddingW * 2)

                // console.log(Math.max(menuBtn.parent.map(btn => btn.width)))
                // menuText.on('pointerdown', function onClick() {
                //     menuText.style = style2
                //     // location.pathname = key.path
                // })
                // menuText.on('pointerup', function onUp() {
                //     menuText.style = style
                // })
                return menuBtn
            })
            this.menu.maxWidth = Math.max(...this.menuBtn.map(btn => btn.width)) + paddingW * 2
            this.menuArea.forEach((area) => {
                area
                    .beginFill()
                    .drawRect(0, 0, this.menu.maxWidth, rowH)
                    .endFill()
            })
            // this.areaW = this.menu.maxWidth + paddingW
            this.menu.x = 1280 + this.menu.maxWidth
            this.drawMenuBg()
            this.drawMenuLine()
            this.menuTween && this.menuTween.kill()
            this.menuTween = TweenMax.to(this.menu, 0.2, {x: 1280 - (this.menu.maxWidth + marginRight)})
            // drag(menuBtn)
        },
        drawMenuBg() {
            const height = this.menu.rowH * this.menuArr.length
            this.menu.bg
                .lineStyle(6, 0x2c2c2c)
                .beginFill(0x000000)
                .drawRoundedRect(0, 0, this.menu.maxWidth, height, 30)
                .endFill()
        },
        drawMenuLine() {
            const line = new Graphics(this.menu, {alpha: 0.8})
            const stepPoint = [
                {point: 0, color: 'transparent'},
                {point: 0.5, color: '#787878'},
                {point: 1, color: 'transparent'}
            ]
            const options = { x2: this.menu.maxWidth, y2: 0, width: this.menu.maxWidth }
            this.menuArr.forEach((key, i) => {
                const y = (i + 1) * this.menu.rowH
                if (i !== this.menuArr.length - 1) {
                    line
                        .beginTextureFill(this.linearGradient(stepPoint, options))
                        .drawRect(0, y, this.menu.maxWidth, 1)
                        .endFill()
                }
            })
        }
    }
}
</script>