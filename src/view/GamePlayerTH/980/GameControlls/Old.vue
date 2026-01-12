<template>
    <div class="gr_game-controller--sin  gr_container  bg_primary  u_inline-field  u_clearfix">
        <div v-if="!isShowDemo">
            <i18n path="common_044">
                <div class="c_input--medium">
                    <!-- 投注金额 -->
                    <input
                        class="c_input__inner"
                        type="tel"
                        v-model="money"
                        @blur="handleBlur"
                        :placeholder="$t('common_061')"
                    />
                </div>
            </i18n>
        </div>

    </div>
</template>
<script>
// <div>
//     <div
//         class="gr_game-controller__money"
//         :class="isActive(i)"
//         v-for="(util, i) in utilArr"
//         :key="util"
//         onselectstart="return false"
//         @click="handleClickRx(i)"
//     >
//         <div class="gr_money__chip">
//             {{util}}
//         </div>
//         <div class="gr_money__coin" />
//     </div>
// </div>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'Old',
    data() {
        return {
            // utilArr: [
            //     5,
            //     10,
            //     50,
            //     100,
            //     200,
            //     500
            // ],
            // utilArrPosition: ''
        }
    },
    watch: {
        TH_lotteryId (v) {
            v && (this.money = '')
        }
    },
    methods: {
        ...mapActions([
            _M.SET_TH_TEMP_DATA
        ]),
        handleBlur() {
            if (!+this.TH_money && this.TH_money !== '') {
                this[_M.SET_TH_TEMP_DATA]({
                    temp: 'TH_money',
                    data: 1
                })
            }
        }
    },
    computed: {
        ...mapGetters([
            'isShowDemo',
            'TH_money',
            'TH_lotteryId'
        ]),
        money: {
            set(data) {
                const temp = (this.TH_money + '').replace(/[^0-9]/g, '')
                const notNum = /[^0-9]/.test(data)
                const isOver = data > 99999999
                this[_M.SET_TH_TEMP_DATA]({
                    temp: 'TH_money',
                    data
                })
                this.$nextTick(() => {
                    if (notNum) {
                        this[_M.SET_TH_TEMP_DATA]({
                            temp: 'TH_money',
                            data: temp
                        })
                    } else if (isOver) {
                        this[_M.SET_TH_TEMP_DATA]({
                            temp: 'TH_money',
                            data: 99999999
                        })
                    }
                })
            },
            get() {
                return this.TH_money
            }
        },
        // gameMenu() {
        //     return this.gameConfigData.gameMethods[this.game.menuIndex]
        // },
        // onePrice() {
        //     return this.gameSubmit.onePrice
        // },
        isBlocked() {

        }
    }
}
</script>
