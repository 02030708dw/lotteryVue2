<template>
    <div class="gr_game-menu">
        <IframeGame
            v-if="$parent.isShowIframe"
            v-show="!$parent.isGameMenuActive"
            :setFrameHeight="setFrameHeight"
            ref="iframeGame"
        />
        <div
            class="gr_games-header__animation"
            :style="{ paddingTop: height }"
            v-if="$parent.isShowIframe"
            v-show="!$parent.isGameMenuActive"
            ref="tip"
        >
            <div class="gr_animation__prompt">
                <!-- '直播开奖仅供参考，开奖号码以官网为主' -->
                <p>★{{ $t("popup_052") }}</p>
            </div>
        </div>
        <div class="gr_game-menu__toggle" :class="gameMenuActiveClass">
            <div class="gr_game-menu__title" @click.stop="toggleMenu">
                {{ `${$t(keyArr[LA_menuIndex])} ${$t(LA_nowGame)}` }}
                <i class="gr_title__icon  el-icon-arrow-down" />
            </div>
        </div>
        <div
            class="gr_game-menu__content no_c_tab"
            v-if="$parent.isGameMenuActive"
        >
            <div class="method_menu">
                <div class="method_title">{{ $t("Glory_5014") }}</div>
                <div class="method_content">
                    <div
                        class="method_items"
                        v-for="(key, i) in LA_gameMenuKey"
                        :key="i"
                        @click="changeGame(+i)"
                        :class="{ is_active: +i === LA_menuIndex }"
                    >
                        {{ $t(key) }}
                    </div>
                </div>
            </div>
            <div class="plays_menu_bg">
                <div class="plays_menu_mask">
                    <div class="plays_menu">
                        <div class="plays_title">{{$t(keyArr[LA_menuIndex])}}</div>
                        <div class="plays_content">
                            <div
                                class="plays_items"
                                v-for="({ title_key, methodId },
                                cbI) in LA_gameSubMenu"
                                :key="cbI"
                                @click="
                                    selectMethod(
                                        !LA_methodSelect[methodId],
                                        methodId
                                    )
                                "
                                :class="{
                                    is_active: LA_methodSelect[methodId],
                                    is_disabled: LA_stop[methodId]
                                }"
                            >
                                {{ $t(title_key) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { scrollToY } from '@UTIL/animationFrame'
export default {
    name: 'GameMenu',
    data() {
        return {
            toggle: false,
            currentNavPosition: 0,
            youTubeHeight: 0,
            timeout: null,
            keyArr: [
                'thai_011',
                'thai_010',
                'thai_009'
            ]
        }
    },
    components: {
        IframeGame: r =>
            require.ensure(
                [],
                () => r(require('./IframeGame')),
                'IframeGame320'
            )
    },
    beforeDestroy() {
        clearTimeout(this.timeout)
    },
    methods: {
        ...mapActions([
            _M.SET_LA_TEMP_DATA
        ]),
        setFrameHeight(height) {
            this.youTubeHeight = height
        },
        toggleMenu() {
            this.$parent.isGameMenuActive = !this.$parent.isGameMenuActive
            if (!this.$parent.isGameMenuActive) {
                this.timeout = setTimeout(() => {
                    this.setFrameHeight(
                        this.$refs.iframeGame &&
                            this.$refs.iframeGame.$refs.iframeBox.clientHeight
                    )
                }, 500)
            } else {
                clearTimeout(this.timeout)
            }
        },
        changeGame(m) {
            // this.toggleMenu()
            this.$router.replace({
                name: 'GamePlayerLA',
                params: { lottery: this.LA_lotteryId },
                query: { m }
            })
            this[_M.SET_LA_TEMP_DATA]({
                temp: 'LA_gameSelectData',
                data: {}
            })
            document.documentElement.scrollTop = 0
        },
        selectMethod(bool, methodId) {
            if (!this.LA_methodSelect[methodId]) {
                this[_M.SET_LA_TEMP_DATA]({
                    temp: 'LA_methodSelect',
                    data: { [methodId]: bool }
                })
                // 清空選擇區
                this[_M.SET_LA_TEMP_DATA]({
                    temp: 'LA_gameSelectData',
                    data: {}
                })
            }
            this.toggleMenu()
        }
    },
    computed: {
        ...mapGetters([
            'LA_menuIndex',
            'LA_gameMenu',
            'LA_gameMenuKey',
            'LA_lotteryId',
            'LA_methodSelect',
            'LA_gameSubMenu',
            'LA_nowGame',
            'LA_stop'
        ]),
        ...mapGetters({
            lotteryId: 'gameLotteryId'
        }),
        gameMenuActiveClass() {
            return this.$parent.isGameMenuActive ? 'is_active' : null
        },
        height() {
            if (this.$parent.isShowIframe && !this.$parent.isGameMenuActive) {
                return this.youTubeHeight + 'px'
            } else {
                return 0
            }
        },
        withoutDanshiGameMenu() {
            return this.gameMenu
        }
    }
}
</script>
