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
                                :disabled="isBlocked"
                                :placeholder="$t('common_061')"
                                v-clean-input:int.long="{val: money, setVal: setMoney, cb: afterCleanInput}"
                            />
                        </div>
                    </i18n>
                    <!-- '奖金' -->
                    <span :class="{ is_strong: prizeIsUpdated }">
                        <span>{{$t('common_038')}} ：</span>
                        <span>{{formatNumber(hprize)}}</span>
                    </span>
                </div>
                <div class="gr_game-controller__total" v-if="!isShowDemo">
                    <!-- {{$t("注")}} path="{0} 元" -->
                    <strong>{{nums}}</strong>{{$t('common_033')}}
                    ，<i18n path="common_044" tag="span">
                        <strong place="0">{{ formatNumber(getMoney) || 0 }}</strong>
                        <template place="1">{{currencySymbol}}</template>
                    </i18n>
                    <span>
                    <!-- 盈利{0} 元 -->
                    <!-- ，<i18n path="common_045" tag="span">
                        <strong place="0">{{ '0' }}</strong>
                        <template place="1">{{currencySymbol}}</template>
                    </i18n> -->
                    </span>
                </div>
                <div class="gr_game-controller__button-group">
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

import { mapGetters, mapActions } from 'vuex'
import { formatNumber, warnMessageBox } from '@UTIL'
export default {
    name: 'GameControlls',
    data() {
        return {
            money: '',
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
        }
    },
    props: {
        isBlocked: Boolean
    },
    computed: {
        ...mapGetters([
            'autoOdds',
            'gameOrder',
            'isShowDemo',
            'blockedMethods',
            'floatPrize',
            'jsPrizePoint',
            'config',
            'methodId',
            'kp',
            'prizeIndex',
            'onePrice',
            'get2Timer',
            'gameLotteryId',
            'prizeIsUpdated',
            'bonusLimit',
            'currentjsDynamicData',
            'currencySymbol'
        ]),
        nums() {
            return formatNumber(this.gameOrder.nums) || 0
        },
        bonus() {
            return formatNumber(this.floorSix(this.gameOrder.bonus))
        },
        // 多獎金資料判斷目前顯示哪筆獎金組
        hprizeIndex() {
            const { hprizeIndex } = this.config || {}
            return hprizeIndex ? this.prizeIndex : 0
        },
        hprize() {
            return this.calcHprize(this.hprizeIndex)
        },
        // 顯示用總金額
        getMoney() {
            return this.gameOrder.money
        },
        // 檢查是否一日兩期
        is2Timer() {
            return this.get2Timer.includes(+this.gameLotteryId)
        }
    },
    methods: {
        ...mapActions([
            _M.SET_SUBMIT_ORDER,
            _M.FAST_GAME_ORDER_SUBMIT,
            _M.SET_GAME_ORDER_DATA,
            _M.SET_SUBMIT_ORDER_MUTI
        ]),
        add() {
            this.submitOrder(() => {
                this[_M.SET_SUBMIT_ORDER_MUTI]()
            })
        },
        fast() {
            this.submitOrder(this[_M.FAST_GAME_ORDER_SUBMIT].bind(null, this))
        },
        submitOrder(submitMethod) {
            // 一日兩期彩種
            if (this.is2Timer) {
                // 檢查是否無獎期
                if (!this.currentjsDynamicData.number) {
                    this.$msg(warnMessageBox({
                        // 尚未开放奖期
                        message: 'common_118'
                    }))
                    return
                }

                // 檢查是否有勾上下午
                const checkObj = this.gameOrder.activeCheckboxes[0]
                if (!checkObj || Object.keys(checkObj).length < 1) {
                    this.$msg(warnMessageBox({
                        // 请选择投注奖期
                        message: 'popup_147'
                    }))
                    return
                }
            }

            //注數為0
            if (this.gameOrder.nums < 1) {
                this.$msg(warnMessageBox({
                    // 号码选择不完整
                    message: 'popup_002',
                    content: 'popup_003'
                }))
                return
            }

            // 檢查是否超過最大金額
            const userBouns = this.hprize * +this.gameOrder.onePrice
            if (userBouns > this.bonusLimit) {
                const {parentName, childNameKey} = this.gameOrder
                const title = `${this.$t(this.keyObj[parentName])}-${this.$t(childNameKey)}`
                this.$msg(warnMessageBox({
                    // 超过投注限制
                    message: this.$t('popup_035'),
                    // 您于【{0}】的投注金额已超过最高投注上限，请重新选择。
                    content: this.$t('popup_074', { '0': title })
                }))
                return
            }

            // check if blocked
            if (this.blockedMethods[this.methodId]) return

            this.$root.$emit('beforeCheck', submitMethod)
        },
        floorSix(num) {
            return Math.floor(+num * 1000000) / 1000000
        },
        formatNumber(n) {
            return formatNumber(n)
        },
        getHprize(index) {
            return this.jsPrizePoint[this.gameOrder.methodId][index]
        },
        /**
         * 計算理論可贏獎金(未扣投注金額)
         * @param index 多獎金 config.hprizeIndex
         */
        calcHprize(index) {
            try {
                const { hprize, autoOdds } = this.getHprize(index)
                return ((+hprize + autoOdds)).strip()
            } catch (error) {
                console.warn(error)
                return ''
            }
        },
        // 設定Money方法, 輸入不合法時觸發
        setMoney(newMoney) {
            this.money = newMoney
        },
        // 投注金額設定&觸發重算
        afterCleanInput(newMoney) {
            this[_M.SET_GAME_ORDER_DATA]({ onePrice: +newMoney })
        },
        // 投注金額檢查最小金額
        handleBlur(e) {
            let newMoney = +e.target.value
            if (+newMoney < +this.onePrice) {
                newMoney = +this.onePrice
                this.money = newMoney
            }
            this[_M.SET_GAME_ORDER_DATA]({ onePrice: +this.money })
        }
    },
    // 因切換玩法後 money 會歸 1，固判斷切換route(玩法)時，更新金額
    watch: {
        $route() {
            this.money && this.afterCleanInput(this.money)
        }
    }
}
</script>
