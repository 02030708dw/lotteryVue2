<template>
<div>
    <div class="gr_game-vn-menu">
        <div class="gr_game-vn-menu__slidePrev" @click="slidePrev"><i class="el-icon-arrow-left" /></div>
        <Hooper :settings="hooperSettings" ref="carousel" class="gr_game-vn-menu__title">
            <slide
                v-for="(lottery, lotteryId) in lotteryListLocalVN"
                :key="lotteryId"
                :class="{is_active: +lotteryId === +VN_lotteryId}"
                @click.native="changeLocaGame(lotteryId)"
            >
                <div>{{$t(lottery.title_key)}}</div>
            </slide>
            <slide
                v-for="(item, index) in VN_gameMenu"
                :key="item.title_key"
                :class="isActive(index)"
                @click.native="changeGame(index)"
                v-if="VN_lotteryOfficialSwitch[item.key] && ((VN_gameType !== 'Old' && index) || VN_gameType === 'Old')"
            >
                <div>{{$t(item.title_key)}}</div>
            </slide>
        </Hooper>
        <div class="gr_game-vn-menu__slideNext" @click="slideNext"><i class="el-icon-arrow-right" /></div>
    </div>
    <div class="gr_game-vn-menu__gameType">
        <div class="gr_game-vn-menu__gameType__content" v-if="!VN_isOnlyOld">
            <!-- '經典' -->
            <div
                v-if="VN_hasOld"
                @click="handleClick('Old')"
                :class="{ is_active: VN_gameType === 'Old' }"
            >
                {{$t('pk10_t_129')}}
            </div>
            <!-- '輸入' -->
            <div
                v-if="VN_hasInput && VN_menuIndex"
                @click="handleClick('Input')"
                :class="{ is_active: VN_gameType === 'Input' }"
            >
                {{$t('vn_t_072')}}
            </div>
            <!-- '快选' -->
            <div
                @click="handleClick('Quick')"
                v-if="VN_hasQuick && VN_menuIndex"
                :class="{ is_active: VN_gameType === 'Quick' }"
            >
                {{$t('vn_t_093')}}
            </div>
            <!-- '快选' -->
            <div
                @click="handleClick('Balls')"
                v-if="VN_hasBall && VN_menuIndex"
                :class="{ is_active: VN_gameType === 'Balls' }"
            >
                {{$t('vn_t_073')}}
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Hooper, Slide } from 'hooper'
import GameMenu from '../980/GameMenu'
export default {
    name: 'GameMenu',
    extends: GameMenu,
    components: {
        Hooper, Slide
    },
    data() {
        return {
            hooperSettings: {
                touchDrag: true,
                mouseDrag: true,
                itemsToShow: 4
                // breakpoints: {
                //     320: {

                //     }
                // 480: {
                //     itemsToShow: 5,
                //     pagination: 'fraction'
                // }
                // }
            }
        }
    },
    methods: {
        // changeGameSubMenu(lotteryId, index) {
        //     if (lotteryId !== this.VN_lotteryId || this.menuIndex !== this.VN_menuIndex || this.VN_subMenuIndex !== index || this.currentGameType !== this.VN_gameType) {
        //         const { p } = this.$route.query
        //         const isShowBlock = this.VN_isLocal
        //             ? lotteryId !== this.VN_lotteryId // 自主彩不一樣時
        //             : lotteryId !== this.VN_lotteryId || this.menuIndex !== +p // 官彩區域不同時

        //         const url = lotteryId
        //             ? `/GamePlayerVN?t=${this.currentGameType}&l=${lotteryId}&p=1&m=${index}`
        //             : `/GamePlayerVN?t=${this.currentGameType}&p=${this.menuIndex}&m=${index}`
        //         this.handleReset(lotteryId)
        //         this.toggleMenu()
        //         this.$router.replace(url)
        //         this.$nextTick(() => {
        //             if (isShowBlock) {
        //                 this.$root.$emit('stopBet')
        //                 this.$root.$emit('blocked')
        //             }
        //         })
        //     }
        // },
        // handleReset(lotteryId) {
        //     // 判斷是不是同類型玩法(輸入/經典)使用不同的重置FN
        //     if (this.currentGameType !== this.VN_gameType) {
        //         this[_M.GAME_ORDER_VN_SUBMIT]({type: 5})
        //         this[_M.GAME_ORDER_VN_SUBMIT]({ type: 8 })
        //     } else {
        //         this.$root.$emit('reset')
        //         // 官彩 lottery會是 0
        //         lotteryId !== this.VN_lotteryId && this[_M.GAME_ORDER_VN_SUBMIT]({ type: 8 })
        //         this.currentGameType === 'Old' && this[_M.GAME_ORDER_VN_SUBMIT]({type: 5})
        //     }
        // },
        slidePrev() {
            this.$refs.carousel.slidePrev()
        },
        slideNext() {
            this.$refs.carousel.slideNext()
        }
    },
    computed: {
        ...mapGetters([
            'VN_gameMenuSubData',
            'VN_gameType',
            'VN_isOld'
        ])
        // currentGameMenuSub() {
        //     return this.VN_gameMenuSubData[this.currentGameType]
        // }
    }
}
</script>