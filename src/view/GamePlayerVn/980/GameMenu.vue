<template>
    <div class="gr_game-vn-menu">
        <div class="gr_game-vn-menu__inner" v-if="!isW88">
            <div class="gr_game-vn-menu__bar">
                <ul class="gr_game-vn-menu__group">
                    <li
                        class="gr_group__item"
                        v-for="(lottery, lotteryId) in lotteryListLocalVN"
                        :key="lotteryId"
                        :class="{is_active: +lotteryId === +VN_lotteryId}"
                        @click="changeLocaGame(lotteryId)"
                    >
                        <span class="gr_item__text">{{$t(lottery.title_key)}}</span>
                    </li>
                    <li
                        class="gr_group__item"
                        v-for="(item, index) in VN_gameMenu"
                        :key="item.title_key"
                        :class="isActive(index)"
                        @click="changeGame(index)"
                        v-if="VN_lotteryOfficialSwitch[item.key] && ((VN_gameType !== 'Old' && index) || VN_gameType === 'Old')"
                    >
                        <span class="gr_item__text">{{$t(item.title_key)}}</span>
                    </li>
                </ul>
            </div>
        </div><!-- gr_game-vn-menu__inner -->
        <div class="gr_game-vn-menu__toggle" v-if="!VN_isOnlyOld">
			<!-- '經典' -->
            <span
                class="gr_toggle__item"
                v-if="VN_hasOld"
                @click="handleClick('Old')"
                :class="{ is_active: VN_gameType === 'Old' }"
            >
                {{$t('pk10_t_129')}}
            </span>
			<!-- '輸入' -->
            <span
                class="gr_toggle__item"
                v-if="VN_hasInput && VN_menuIndex"
                @click="handleClick('Input')"
                :class="{ is_active: VN_gameType === 'Input' }"
            >
                {{$t('vn_t_072')}}
            </span>
            <!-- '快选' -->
            <span
                v-if="VN_hasQuick && VN_menuIndex"
                class="gr_toggle__item"
                @click="handleClick('Quick')"
                :class="{ is_active: VN_gameType === 'Quick' }"
            >
                {{$t('vn_t_093')}}
            </span>
            <!-- '球版' -->
            <span
                v-if="VN_hasBall && VN_menuIndex"
                class="gr_toggle__item"
                @click="handleClick('Balls')"
                :class="{ is_active: VN_gameType === 'Balls' }"
            >
                {{$t('vn_t_073')}}
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
            _M.SET_GAME_VN_DATA,
            _M.GAME_ORDER_VN_SUBMIT
        ]),
        changeGame(index) {
            const { p } = this.$route.query
            this.$router.replace(`/GamePlayerVN?t=${this.VN_gameType}&p=${index}`)
            this.$root.$emit('reset')
            ;(!this.VN_isOld && this.VN_lotteryId) && this[_M.GAME_ORDER_VN_SUBMIT]({type: 1, showList: [], ltMoneyAmout: 0, times: 1})
            ;(+p !== index || this.VN_lotteryId) && this.$nextTick(() => {
                this.$root.$emit('stopBet')
                this.$root.$emit('blocked')
            })
        },
        changeLocaGame(lotteryId) {
            if (lotteryId !== this.VN_lotteryId) {
                this.$router.replace(`/GamePlayerVN?t=${this.VN_gameType}&p=1&l=${lotteryId}`)
                this.$root.$emit('reset')
                !this.VN_isOld && this[_M.GAME_ORDER_VN_SUBMIT]({type: 1, showList: [], ltMoneyAmout: 0, times: 1})
                this.$nextTick(() => {
                    this.$root.$emit('stopBet')
                    this.$root.$emit('blocked')
                })
            }
        },
        isActive(index) {
            return { is_active: index === this.VN_menuIndex && !this.VN_lotteryId }
        },
        /** 改變及經典球版輸入的切換 */
        handleClick(type) {
            if (type !== this.VN_gameType) {
                let router = `/GamePlayerVN?t=${type}&p=${this.VN_menuIndex}&m=0`
                this.VN_lotteryId && (router += `&l=${this.VN_lotteryId}`)
                this.$root.$emit('reset')
                this[_M.GAME_ORDER_VN_SUBMIT]({ type: 8 })
                this.$router.replace(router)
            }
        }
    },
    computed: {
        ...mapGetters([
            'lang',
            'isW88',
            'isDev',
            'VN_menuIndex',
            'VN_subMenuIndex',
            'VN_isOld',
            'VN_isOnlyOld',
            'VN_hasOld',
            'VN_hasBall',
            'VN_hasInput',
            'VN_hasQuick',
            'lotteryMenu',
            'VN_gameType',
            'VN_gameMenu',
            'VN_gameConfig',
            'VN_gameMenuSub',
            'VN_lotteryId',
            'lotteryListLocalVN',
            'VN_lotteryOfficialSwitch'
        ])
    }
}
</script>
