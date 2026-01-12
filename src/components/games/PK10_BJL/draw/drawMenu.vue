<script>
import drag from '@C/pixi/drag'
import Button from '@C/pixi/components/Button'
import Sprite from '@C/pixi/components/Sprite'
import Container from '@C/pixi/components/Container'
import drawMenu from '@C/games/components/Table/draw/drawMenu'

import { mapActions } from 'vuex'
import { warnMessageBox } from '@UTIL'
// import * as PIXI from 'pixi.js'

export default {
    name: 'drawMenu',
    mixins: [drawMenu],
    methods: {
        ...mapActions([
            _M.SET_POP_ACTIVE
        ]),
        dragMenuBtn() {
            const p = new Container(this.container, {name: 'MenuBtn'})
            const menuBtn = new Button({ id: 'btn', key: 'BJL_Button', x: 1180, y: 17, p }, {
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
                            menuBtn.setTextureKey('BJL_Button')
                            menuBtnSymbol.rotation = 0
                        }
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        this.isVsible = !this.isVsible
                        if (this.isVsible) {
                            this.drawMenu(menuBtn)
                            this.front.addChild(menuBtn)
                            this.mask.show(menuBtn, hideFn)
                            menuBtn.setTextureKey('BJL_Button_c')
                            menuBtnSymbol.rotation = Math.PI / -2
                        } else {
                            this.mask.hide(menuBtn)
                        }
                    }
                }
            })
            const menuBtnSymbol = new Sprite({ id: 'btn', key: 'BJL_Arrow', anchor: { x: 0.5, y: 0.5 }, x: 44, y: 44, p: menuBtn })

            // this.drawMenu()
            const playInfoBtn = new Button({ id: 'btn', key: 'BJL_Button', x: 1180, y: 105, p }, {
                down: { textureID: 'BJL_Button_c' },
                up: {
                    textureID: 'BJL_Button',
                    fn: () => {
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        this.drawPlayInfo()
                    }
                },
                out: {
                    textureID: 'BJL_Button'
                }
            })
            const playInfoBtnSymbol = new Sprite({ id: 'btn', key: 'BJL_QuestMark', x: 35, y: 25, p: playInfoBtn })
            // drag(playInfoBtnSymbol)
            const favouriteBtn = new Button({ id: 'btn', key: 'BJL_Button', x: 1180, y: 193, p }, {
                down: { textureID: 'BJL_Button_c' },
                up: {
                    textureID: 'BJL_Button',
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
                                favouriteBtnSymbol.setTextureKey(this.favouriteKey)
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
                out: {
                    textureID: 'BJL_Button'
                }
            })
            const favouriteBtnSymbol = new Sprite({ id: 'btn', key: this.favouriteKey, anchor: { x: 0.5, y: 0.5 }, x: 44, y: 44, p: favouriteBtn })
        },
        drawMenuBg() {
            const height = this.menu.rowH * this.menuArr.length
            this.menu.bg
                .lineStyle(6, 0x2c2c2c)
                .beginFill(0x000000)
                .drawRoundedRect(0, 0, this.menu.maxWidth, height, 30)
                .endFill()
        }
    },
    computed: {
        favouriteKey() {
            return this.isInFavorites ? 'BJL_favouritec' : 'BJL_favourite'
        }
    }
}
</script>