<template>
    <div class="gr_game-vn-menu">
        <div class="gr_game-vn-menu__inner">
            <div class="gr_game-vn-menu__bar">
                <ul class="gr_game-vn-menu__group">
                    <li
                        class="gr_group__item"
                        :class="{is_active: +i === TH_menuIndex}"
                        v-for="(key, i) in TH_gameMenuKey"
                        :key="i"
                        @click="changeGame(+i)"
                    >
                        <span class="gr_item__text">{{$t(key)}}</span>
                    </li>
                </ul>
            </div>
        </div><!-- gr_game-vn-menu__inner -->
        <div class="gr_game-vn-menu__toggle" v-show="false">
			<!-- '經典' -->
            <span
                class="gr_toggle__item"
                @click="handleClick('Old')"
                :class="{ is_active: TH_gameType === 'Old' }"
            >
                {{$t('pk10_t_129')}}
            </span>
			<!-- '輸入' -->
            <span
                class="gr_toggle__item"
                v-if="!TH_isOld"
                @click="handleClick('Input')"
                :class="{ is_active: TH_gameType === 'Input' }"
            >
                {{$t('TH_t_072')}}
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
            // _M.SET_GAME_TH_DATA,
            // _M.GAME_ORDER_TH_SUBMIT
        ]),
        changeGame(index) {
            this.$router.replace({
                name: 'GamePlayerTH',
                params: { lottery: this.TH_lotteryId },
                query: {
                    t: this.TH_gameType,
                    m: index
                }
            })
            this.$root.$emit('reset')
            ;(!this.TH_isOld) && this[_M.GAME_ORDER_TH_SUBMIT]({type: 1, showList: [], ltMoneyAmout: 0, times: 1})
        },
        isActive(index) {
            return { is_active: index === this.TH_menuIndex }
        },
        /** 改變及經典球版輸入的切換 */
        handleClick(type) {
            if (type !== this.TH_gameType) {
                let router = {
                    name: 'GamePlayerTH',
                    params: { lottery: this.TH_lotteryId },
                    query: {
                        t: type,
                        m: this.TH_menuIndex
                    }
                }
                this.$root.$emit('reset')
                this[_M.GAME_ORDER_TH_SUBMIT]({ type: 8 })
                this.$router.replace(router)
            }
        }
    },
    computed: {
        ...mapGetters([
            'TH_menuIndex',
            'TH_isOld',
            // 'TH_isOnlyOld',
            // 'lotteryMenu',
            'TH_gameType',
            // 'TH_gameMenu',
            'TH_gameMenu',
            'TH_gameMenuKey',
            // 'TH_gameMenuSub',
            'TH_lotteryId'
        ])
    }

}
</script>
