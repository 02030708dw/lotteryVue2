<template>
    <div class="gr_game-vn-menu">
        <div class="gr_game-vn-menu__inner">
            <div class="gr_game-vn-menu__bar">
                <ul class="gr_game-vn-menu__group">
                    <li
                        class="gr_group__item"
                        :class="{is_active: +i === MY_menuIndex}"
                        v-for="(key, i) in MY_gameMenuKey"
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
                :class="{ is_active: MY_gameType === 'Old' }"
            >
                {{$t('pk10_t_129')}}
            </span>
			<!-- '輸入' -->
            <span
                class="gr_toggle__item"
                v-if="!MY_isOld"
                @click="handleClick('Input')"
                :class="{ is_active: MY_gameType === 'Input' }"
            >
                {{$t('MY_t_072')}}
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
            _M.SET_MY_TEMP_DATA
            // _M.GAME_ORDER_MY_SUBMIT
        ]),
        changeGame(index) {
            this.$router.replace({
                name: 'GamePlayerMY',
                params: { lottery: this.MY_lotteryId },
                query: {
                    t: this.MY_gameType,
                    m: index
                }
            })
            this[_M.SET_MY_TEMP_DATA]({
                temp: 'MY_gameSelectData',
                data: {}
            })
            ;(!this.MY_isOld) && this[_M.GAME_ORDER_MY_SUBMIT]({type: 1, showList: [], ltMoneyAmout: 0, times: 1})
        },
        isActive(index) {
            return { is_active: index === this.MY_menuIndex }
        },
        /** 改變及經典球版輸入的切換 */
        handleClick(type) {
            if (type !== this.MY_gameType) {
                let router = {
                    name: 'GamePlayerMY',
                    params: { lottery: this.MY_lotteryId },
                    query: {
                        t: type,
                        m: this.MY_menuIndex
                    }
                }
                this.$root.$emit('reset')
                this[_M.GAME_ORDER_MY_SUBMIT]({ type: 8 })
                this.$router.replace(router)
            }
        }
    },
    computed: {
        ...mapGetters([
            'MY_menuIndex',
            'MY_isOld',
            // 'MY_isOnlyOld',
            // 'lotteryMenu',
            'MY_gameType',
            // 'MY_gameMenu',
            'MY_gameMenu',
            'MY_gameMenuKey',
            // 'MY_gameMenuSub',
            'MY_lotteryId'
        ])
    }

}
</script>
