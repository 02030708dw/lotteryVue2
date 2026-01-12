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
                    <span :class="{ is_strong: LA_prizeChange[LA_methodIsSelect[0]]}">
                        <span>{{$t('common_038')}} ：</span>
                        <span>{{formatNumber(LA_nowPrize) || 0}}</span>
                    </span>
                </div>
                <div class="gr_game-controller__total" v-if="!isShowDemo">
                    <!-- {{$t("注")}} path="{0} 元" -->
                    <strong>{{LA_gameSelectDataArr.length}}</strong>{{$t('common_033')}}
                    ，<i18n path="common_044" tag="span">
                        <strong place="0">{{ formatNumber(LA_gameSelectDataMoney) || 0 }}</strong>
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
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
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
        LA_lotteryId (v) {
            v && (this.money = '')
        }
    },
    methods: {
        ...mapActions([
            _M.SET_LA_TEMP_DATA,
            _M.GAME_ORDER_LA_SUBMIT
        ]),
        handleBlur() {
            if ((!+this.LA_money && this.LA_money !== '') || this.LA_money < +this.LA_stake) {
                this[_M.SET_LA_TEMP_DATA]({
                    temp: 'LA_money',
                    data: +this.LA_stake
                })
                this.$nextTick(() => {
                    let obj = {}
                    returnState(this.LA_gameSelectDataArr).forEach((item) => {
                        obj[`${item.methodId}_${item.codes}`] = item
                        item.money = +this.LA_money
                    })
                    this[_M.SET_LA_TEMP_DATA]({
                        temp: 'LA_gameSelectData',
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
            const overLimit = this.LA_gameSelectDataArr.find(({money}) => money * this.LA_nowPrize > this.LA_bonus_limit)
            console.log(overLimit)
            const { title_key, parent } = this.LA_gameSubMenuObj[overLimit.methodId]
            const title = `${this.$t(this.keyObj[parent.toUpperCase()])}-${this.$t(title_key)}`
            this.$msg(warnMessageBox({
                // 超过投注限制
                message: this.$t('popup_035'),
                // 您于【{0}】的投注金额已超过最高投注上限，请重新选择。
                content: this.$t('popup_074', { '0': title })
            }))
        },
        fast() {
            if (!this.LA_gameSelectDataMoney) {
                return this.$msg(warnMessageBox({
                    message: 'popup_002',
                    content: 'popup_003'
                }))
            }
            const userBouns = this.LA_nowPrize * this.LA_money
            if (userBouns > this.LA_bonus_limit) {
                return this.showLimitAlert()
            }
            this[_M.GAME_ORDER_LA_SUBMIT]({fast: true})
        },
        add() {
            if (!this.LA_gameSelectDataMoney) {
                return this.$msg(warnMessageBox({
                    message: 'popup_002',
                    content: 'popup_003'
                }))
            }
            const userBouns = this.LA_nowPrize * this.LA_money
            if (userBouns > this.LA_bonus_limit) {
                return this.showLimitAlert()
            }

            let isSame = false
            let data = returnState(this.LA_gameOrder)
            Object.entries(this.LA_gameSelectData).forEach(([key, val]) => {
                if (data[key]) {
                    isSame = true
                    data[key].money += val.money
                } else {
                    data[key] = val
                }
            })
            this[_M.SET_LA_TEMP_DATA]({
                temp: 'LA_gameOrder',
                data
            })
            this[_M.SET_LA_TEMP_DATA]({
                temp: 'LA_gameSelectData',
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
            this[_M.SET_LA_TEMP_DATA]({
                temp: 'LA_gameSelectData',
                data: {}
            })
            this.$root.$emit('reset')
        }
    },
    computed: {
        ...mapGetters([
            'isShowDemo',
            'LA_stop',
            'LA_money',
            'LA_stake',
            'LA_lotteryId',
            'LA_gameSelectData',
            'LA_gameOrder',
            'LA_gameSelectDataMoney',
            'LA_gameSubMenuObj',
            'LA_nowPrize',
            'LA_methodIsSelect',
            'LA_prizeChange',
            'LA_bonus_limit',
            'LA_gameSelectDataArr',
            'currencySymbol'
        ]),
        money: {
            set(data) {
                const temp = (this.LA_money + '').replace(/[^0-9]/g, '')
                const notNum = /[^0-9]/.test(data)
                const isOver = data > 99999999
                let tempMoney = data
                this[_M.SET_LA_TEMP_DATA]({
                    temp: 'LA_money',
                    data
                })
                this.$nextTick(() => {
                    if (notNum) {
                        this[_M.SET_LA_TEMP_DATA]({
                            temp: 'LA_money',
                            data: temp
                        })
                        tempMoney = temp
                    } else if (isOver) {
                        this[_M.SET_LA_TEMP_DATA]({
                            temp: 'LA_money',
                            data: 99999999
                        })
                        tempMoney = 99999999
                    }
                    let obj = {}
                    returnState(this.LA_gameSelectDataArr).forEach((item) => {
                        obj[`${item.methodId}_${item.codes}`] = item
                        item.money = +tempMoney
                    })
                    this[_M.SET_LA_TEMP_DATA]({
                        temp: 'LA_gameSelectData',
                        data: obj
                    })
                })
            },
            get() {
                return this.LA_money
            }
        },
        // gameMenu() {
        //     return this.gameConfigData.gameMethods[this.game.menuIndex]
        // },
        // onePrice() {
        //     return this.gameSubmit.onePrice
        // },
        isBlocked() {
            return this.LA_stop[this.LA_methodIsSelect[0]]
        }
    }
}
</script>
