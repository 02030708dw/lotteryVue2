<template>
    <div class="gr_home__lottery-category  bg_primary u_clearfix">
        <div class="gr_lottery-category__lottery"
            v-for="(menu, i) in gameMenu"
            :key="menu.title"
            :class="{
                'gr_lottery-category__lottery2': menu.menuId === 4,
                [`c_lottery-class--${menu.class}`]: true,
                'c_lottery-class--K3_YXX': (lotteryList2[menu.lottery] || {}).function_type === 'K3_YXX', //魚蝦蟹特例
                'c_lottery--disabled': menu.isNotOpen,
                [`c_lottery--${menu.lottery}`]: true}"
				@click="menuClick(menu)">

            <!-- 桌面玩法 -->
            <div
                class="gr_lottery-category__warp"
                v-if="menu.menuId === 4"
            >
                <svgl
                    ref="tableSvg"
                    :lotteryId="menu.lottery"
                    :menuId="menu.menuId"
                    :menuClass="menu.class"
                    :title="menu.title_key"
                />
            </div>
            <template v-else>
                <!-- 越南彩種 -->
                <img
                    v-if="menu.class && menu.class === 'VIETNAM'"
                    class="gr_lottery-category__img"
                    :src="`static/image/lang_${lang}/c_lottery-category/c_lottery-class--${isPathVN(menu)}/c_lottery--${menu.lottery}.svg`"
                />
                <!-- 其他彩種 -->
                <img
                    v-else
                    class="gr_lottery-category__img"
                    :src="`static/image/lang_${lang}/c_lottery-category/c_lottery-class--${menu.class}/c_lottery--${menu.lottery}.svg`"
                />
            </template>
            <!-- 背景圖 -->
            <img
                v-if="menu.menuId === 4"
                class="gr_lottery-category__background"
                :src="`static/image/lotteryBg/c_lottery-class--${menu.class}-bg.png`"
                alt=""
            />
            <img
                v-else
                class="gr_lottery-category__background"
                :src="`static/image/lang_cn/c_lottery-category/c_lottery-class--${menu.class}/c_lottery-class--${menu.class}-bg.png`"
                alt=""
            />
            <a class="gr_lottery-category__link" v-if="menu.isNotOpen">
                <span>
                    <!-- {{$t("暂时关闭")}} -->
                    {{$t('home_003')}}
                </span>
            </a>
            <router-link class="gr_lottery-category__link" :to="gameRouter(menu.router, menu.lottery)" v-else>
                <span class="gr_lottery-category__title">
                    <span class="gr_title__text">{{$t(menu.title_key)}}</span>
                    <i class="gr_title__icon" :class="getIcon(menu)" />
                </span>
            </router-link>
        </div>
    </div>
</template>
<script>
import iframeGameSource from '@UTIL/games/iframeGameSource'
import svgl from './svgl'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'lottery_category',
    components: {
        svgl
    },
    props: {
        gameMenu: Array
    },
    created() {
        window.addEventListener('resize', this.handleResize, false)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize, false)
    },
    watch: {
        lang(l) {
            this.handleResize()
        }
    },
    computed: {
        ...mapGetters([
            'lang',
            'lotteryList2'
        ]),
        isiframeGame() {
            return iframeGameSource
        }
    },
    methods: {
        ...mapActions([
            _M.SET_MENU_ID
        ]),
        isPathVN(menu) {
            switch (menu.lottery) {
                // 爱国彩
                case 256:
                    return 'VN_256'
                // 越南彩
                case 'vietnam':
                    return menu.class
                default:
                    return menu.name
            }
        },
        getIcon(menus) {
            const isPlay = !!this.isiframeGame[menus.lottery]
            // 0: 未封盤; 1:封盤
            const isBlocked = menus.is_blocked || 0

            if (isBlocked) {
                return 'i_blockade'
            } else if (isPlay) {
                return 'i_play'
            }

            return ''
        },
        gameRouter(router, lottery) {
            return router || `/GamePlayer/${lottery}`
        },
        menuClick(menuData) {
            const {menuId} = menuData
            this[_M.SET_MENU_ID](menuId)
        },
        handleResize() {
            // 調整桌面玩法弧度文字對齊
            this.$refs.tableSvg.forEach((oneSvg) => {
                oneSvg.handleResize()
            })
        }
    }
}
</script>