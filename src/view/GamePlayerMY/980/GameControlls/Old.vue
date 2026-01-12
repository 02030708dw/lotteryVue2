<template>
    <div class="gr_game-controller  gr_container  u_clearfix  bg_primary">
        <div class="gr_game-controller__inner">
            <div class="gr_game-controller__row">
                <div class="gr_game-stock_input">
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
                    <!-- '奖金' -->
                    <span :class="{ is_strong: MY_prizeChange[MY_methodIsSelect[0]]}">
                        <span>{{$t('common_038')}} ：</span>
                        <span>{{formatNumber(MY_nowPrize) || 0}}</span>
                    </span>
                </div>
                <div class="gr_game-controller__total" v-if="!isShowDemo">
                    <!-- {{$t("注")}} path="{0} 元" -->
                    <strong>{{MY_gameSelectDataArr.length}}</strong>{{$t('common_033')}}
                    ，<i18n path="common_044" tag="span">
                        <strong place="0">{{ formatNumber(MY_gameSelectDataMoney) || 0 }}</strong>
                        <template place="1">{{currencySymbol}}</template>
                    </i18n>
                </div>
                <div class="gr_game-controller__button-group">
                    <button
                        class="c_button--large c_button--default"
                        @click.stop="handleReset"
                    >
                        <!-- '重置' -->
                        <span class="c_button__text">{{$t('common_062')}}</span>
                    </button>
                    <button
                        :class="['c_button--large', !isBlocked ? 'c_button--primary' : 'c_button--disabled']"
                        :disabled="isBlocked"
                        @click="fast"
                    >
                        <!-- "直接投注" : '本期停售'-->
                        <span class="c_button__text">{{$t((!isBlocked) ? "common_046" : "common_068")}}</span>
                    </button>
                    <button
                        class="c_button--secondary  c_button--large"
                        @click="add"
                        v-if="!isBlocked"
                    >
                        <i class="c_button__icon  el-icon-plus" />
                        <span class="c_button__text">
                            <!-- {{$t("投注项")}} -->
                            {{$t('common_047')}}
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div class="u_hr" />
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
import { formatNumber, returnState, warnMessageBox } from '@UTIL'

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
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
        }
    },
    watch: {
        MY_lotteryId (v) {
            v && (this.money = '')
        }
    },
    methods: {
        ...mapActions([
            _M.SET_MY_TEMP_DATA,
            _M.GAME_ORDER_MY_SUBMIT
        ]),
        handleBlur() {
            if ((!+this.MY_money && this.MY_money !== '') || this.MY_money < +this.MY_stake) {
                this[_M.SET_MY_TEMP_DATA]({
                    temp: 'MY_money',
                    data: +this.MY_stake
                })
                this.$nextTick(() => {
                    let obj = {}
                    returnState(this.MY_gameSelectDataArr).forEach((item) => {
                        obj[`${item.methodId}_${item.codes}`] = item
                        item.money = +this.MY_money
                    })
                    this[_M.SET_MY_TEMP_DATA]({
                        temp: 'MY_gameSelectData',
                        data: obj
                    })
                })
            }
        },
        formatNumber(n) {
            return formatNumber(n)
        },
        // 超過最大金額彈窗
        showLimitAlert() {
            const overLimit = this.MY_gameSelectDataArr.find(({money}) => money * this.MY_nowPrize > this.MY_bonus_limit)
            const { title_key, parent } = this.MY_gameSubMenuObj[overLimit.methodId]
            const title = `${this.$t(this.keyObj[parent.toUpperCase()])}-${this.$t(title_key)}`
            this.$msg(warnMessageBox({
                // 超过投注限制
                message: this.$t('popup_035'),
                // 您于【{0}】的投注金额已超过最高投注上限，请重新选择。
                content: this.$t('popup_074', { '0': title })
            }))
        },
        fast() {
            if (!this.MY_gameSelectDataMoney) {
                return this.$msg(warnMessageBox({
                    message: 'popup_002',
                    content: 'popup_003'
                }))
            }
            const userBouns = this.MY_nowPrize * this.MY_money
            if (userBouns > this.MY_bonus_limit) {
                return this.showLimitAlert()
            }
            this[_M.GAME_ORDER_MY_SUBMIT]({fast: true})
        },
        add() {
            if (!this.MY_gameSelectDataMoney) {
                return this.$msg(warnMessageBox({
                    message: 'popup_002',
                    content: 'popup_003'
                }))
            }
            const userBouns = this.MY_nowPrize * this.MY_money
            if (userBouns > this.MY_bonus_limit) {
                return this.showLimitAlert()
            }

            let isSame = false
            let data = returnState(this.MY_gameOrder)
            Object.entries(this.MY_gameSelectData).forEach(([key, val]) => {
                if (data[key]) {
                    isSame = true
                    data[key].money += val.money
                } else {
                    data[key] = val
                }
            })
            this[_M.SET_MY_TEMP_DATA]({
                temp: 'MY_gameOrder',
                data
            })
            this[_M.SET_MY_TEMP_DATA]({
                temp: 'MY_gameSelectData',
                data: {}
            })
            isSame && this.$msg(warnMessageBox({
                // 号码已在投注项内
                message: 'popup_022',
                // 您选择的号码已在投注项内，将直接进行倍数累加
                content: 'popup_023'
            }))
            this.$root.$emit('reset')
        },
        handleReset() {
            this[_M.SET_MY_TEMP_DATA]({
                temp: 'MY_gameSelectData',
                data: {}
            })
            this.$root.$emit('reset')
        }
    },
    computed: {
        ...mapGetters([
            'isShowDemo',
            'MY_stop',
            'MY_money',
            'MY_stake',
            'MY_lotteryId',
            'MY_gameSelectData',
            'MY_gameOrder',
            'MY_gameSelectDataMoney',
            'MY_gameSubMenuObj',
            'MY_nowPrize',
            'MY_methodIsSelect',
            'MY_prizeChange',
            'MY_bonus_limit',
            'currencySymbol',
            'MY_gameSelectDataArr'
        ]),
        money: {
            set(data) {
                const temp = (this.MY_money + '').replace(/[^0-9]/g, '')
                const notNum = /[^0-9]/.test(data)
                const isOver = data > 99999999
                let tempMoney = data
                this[_M.SET_MY_TEMP_DATA]({
                    temp: 'MY_money',
                    data
                })
                this.$nextTick(() => {
                    if (notNum) {
                        this[_M.SET_MY_TEMP_DATA]({
                            temp: 'MY_money',
                            data: temp
                        })
                        tempMoney = temp
                    } else if (isOver) {
                        this[_M.SET_MY_TEMP_DATA]({
                            temp: 'MY_money',
                            data: 99999999
                        })
                        tempMoney = 99999999
                    }
                    let obj = {}
                    returnState(this.MY_gameSelectDataArr).forEach((item) => {
                        obj[`${item.methodId}_${item.codes}`] = item
                        item.money = +tempMoney
                    })
                    this[_M.SET_MY_TEMP_DATA]({
                        temp: 'MY_gameSelectData',
                        data: obj
                    })
                })
            },
            get() {
                return this.MY_money
            }
        },
        // gameMenu() {
        //     return this.gameConfigData.gameMethods[this.game.menuIndex]
        // },
        // onePrice() {
        //     return this.gameSubmit.onePrice
        // },
        isBlocked() {
            return this.MY_stop[this.MY_methodIsSelect[0]]
        }
    }
}
</script>
