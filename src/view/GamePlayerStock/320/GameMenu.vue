<template>
    <div class="gr_game-menu">
        <div class="gr_game-menu__toggle" :class="gameMenuActiveClass">
            <div
                class="gr_game-menu__title"
                @click.stop="toggleMenu"
            >
                {{$t(keyObj[gameOrder.parentName])}} {{$t(gameOrder.childNameKey)}}
                <i class="gr_title__icon  el-icon-arrow-down" />
            </div>
        </div>
        <div class="gr_game-menu__content no_c_tab" v-if="gameMenuActive">
            <div class="method_menu">
                <div class="method_title">{{$t('Glory_5014')}}</div>
                <div class="method_content">
                    <div
                        class="method_items"
                        v-for="(menu, i) in gameMenu"
                        :key="menu.title"
                        @click="changeMethodKey(menu.title_key)"
                        :class="{is_active: menu.title_key === checkMethodKey}"
                    >
                        {{$t(keyObj[menu.title])}}
                    </div>
                </div>
            </div>
            <div class="plays_menu_bg" v-if="getStockPlaysMenu">
                <div class="plays_menu_mask">
                    <div class="plays_menu" v-for="plays in getStockPlaysMenu" :key="plays.title_key">
                        <div class="plays_title">{{$t(keyObj[plays.title])}}</div>
                        <div class="plays_content">
                            <div
                                class="plays_items"
                                v-for="item in plays.childs"
                                :key="item.title_key"
                                @click.stop="changeGame(`${item.mode}_${item.parent}_${getTypeName(item.name)}`)"
                                :class="isActive(`${item.mode}_${item.parent}_${getTypeName(item.name)}`)"
                            >
                                {{$t(item.title_key)}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="c_collapse">
                <div
                    class="c_collapse__item"
                    :class="{is_active: toggle && i === currentNavPosition}"
                    v-for="(menu, i) in gameMenu"
                    :key="menu.title"
                    @click="handleClick(i)"
                >
                    <div class="c_item__header">
                        {{$t(menu.title_key)}}
                        <i class="c_item__arrow  el-icon-arrow-right" />
                    </div>
                    <div class="c_item__content">
                        <div class="c_content__inner">
                            <div
                                class="c_content__link"
                                v-for="{menuKey, title_key} in concatAll(menu)"
                                @click.stop="changeGame(menuKey)"
                                :class="{is_active: menuKey === gameOrder.typeName}"
                                :key="menuKey"
                            >
                                {{$t(title_key)}}{{menuKey}}
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import GameMenu from '../980/GameMenu'
import { mapActions, mapGetters } from 'vuex'
import { scrollToY } from '@UTIL/animationFrame'
export default {
    name: 'GameMenu320',
    mixins: [GameMenu],
    data() {
        return {
            toggle: false,
            currentNavPosition: 0,
            width: 0,
            checkMethodKey: '',
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
        }
    },
    created() {
        this.checkMethodKey = this.gameOrder.parentNameKey
    },
    destroyed() {
        this.gameMenuActive && this.toggleMenu()
    },
    methods: {
        ...mapActions([
            _M.GET_GAME_INDEX,
            _M.SET_GAME_MENU_ACTIVE,
            _M.SET_SCORE_SHOW
        ]),
        setFrameWidth(width) {
            this.width = width
        },
        toggleMenu() {
            this[_M.SET_GAME_MENU_ACTIVE]()

            // 打開菜單時
            if (this.gameMenuActive) {
                // 訂正麵包削提示
                if (!this.isSin) {
                    this.currentNavPosition = this.menuIndex
                    this.toggle = true
                }
            }
        },
        changeGame(subGameName) {
            this.toggleMenu()
            this.$router.replace({
                name: 'GamePlayerStock',
                params: { lottery: this.lotteryId },
                query: { sub: subGameName }
            })
            document.documentElement.scrollTop = 0
        },
        concatAll(menu) {
            let items = []
            menu.childs.forEach(menu2 =>
                menu2.childs.forEach(menu3 => {
                    const {mode, name, parent} = menu3
                    const menuKey = `${mode}_${parent}_${name}`.replace('.', '_')
                    items.push({ ...menu3, menuKey })
                })
            )
            return items
        },
        handleClick(i) {
            if (this.currentNavPosition === i) {
                this.toggle = !this.toggle
            } else {
                this.currentNavPosition = i
                this.toggle = true
                scrollToY(i * 58)
            }
        },
        changeMethodKey(key) {
            this.checkMethodKey = key
        },
        getTypeName(typeName) {
            return typeName.replace(/\./g, '_')
        },
        isActive(urlTypeName) {
            return this.gameOrder.typeName === urlTypeName ? 'is_active' : ''
        }
    },
    computed: {
        ...mapGetters([
            'game',
            'gameOrder',
            'gameMenuActive',
            'gameMenu'
        ]),
        gameMenuActiveClass() {
            return this.gameMenuActive ? 'is_active' : null
        },
        height() {
            if (this.isShowIframe && !this.gameMenuActive) {
                const {width, height} = this.iframeGame
                const ratio = width / height
                return this.width / ratio + 'px'
            }
            return 0
        },
        getStockPlaysMenu() {
            const method = this.gameMenu.filter(({title_key}) => title_key === this.checkMethodKey)[0]
            return (method || {}).childs
        }
    }
}
</script>
