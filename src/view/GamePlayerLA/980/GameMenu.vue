<template>
    <div class="gr_game-vn-menu">
        <div class="gr_game-vn-menu__inner">
            <div class="gr_game-vn-menu__bar">
                <ul class="gr_game-vn-menu__group">
                    <li
                        class="gr_group__item"
                        :class="{is_active: +i === LA_menuIndex}"
                        v-for="(key, i) in LA_gameMenuKey"
                        :key="i"
                        @click="changeGame(+i)"
                    >
                        <span class="gr_item__text">{{ $t(key) }}</span>
                    </li>
                </ul>
            </div>
        </div><!-- gr_game-vn-menu__inner -->
        <div class="gr_game-vn-menu__toggle" v-show="false">
			<!-- '經典' -->
            <span
                class="gr_toggle__item"
                @click="handleClick('Old')"
                :class="{ is_active: LA_gameType === 'Old' }"
            >
                {{$t('pk10_t_129')}}
            </span>
			<!-- '輸入' -->
            <span
                class="gr_toggle__item"
                v-if="!LA_isOld"
                @click="handleClick('Input')"
                :class="{ is_active: LA_gameType === 'Input' }"
            >
                {{$t('LA_t_072')}}
            </span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'GameMenu',
    methods: {
        ...mapActions([
            _M.SET_LA_TEMP_DATA
            // _M.GAME_ORDER_LA_SUBMIT
        ]),
        changeGame(index) {
            this.$router.replace({
                name: 'GamePlayerLA',
                params: { lottery: this.LA_lotteryId },
                query: {
                    t: this.LA_gameType,
                    m: index
                }
            })
            this[_M.SET_LA_TEMP_DATA]({
                temp: 'LA_gameSelectData',
                data: {}
            })
            ;(!this.LA_isOld) && this[_M.GAME_ORDER_LA_SUBMIT]({type: 1, showList: [], ltMoneyAmout: 0, times: 1})
        },
        isActive(index) {
            return { is_active: index === this.LA_menuIndex }
        },
        /** 改變及經典球版輸入的切換 */
        handleClick(type) {
            if (type !== this.LA_gameType) {
                let router = {
                    name: 'GamePlayerLA',
                    params: { lottery: this.LA_lotteryId },
                    query: {
                        t: type,
                        m: this.LA_menuIndex
                    }
                }
                this.$root.$emit('reset')
                this[_M.GAME_ORDER_LA_SUBMIT]({ type: 8 })
                this.$router.replace(router)
            }
        }
    },
    computed: {
        ...mapGetters([
            'LA_menuIndex',
            'LA_isOld',
            'LA_gameMenuKey',
            // 'LA_isOnlyOld',
            // 'lotteryMenu',
            'LA_gameType',
            // 'LA_gameMenu',
            'LA_gameMenu',
            // 'LA_gameMenuSub',
            'LA_lotteryId'
        ])
    }

}
</script>
