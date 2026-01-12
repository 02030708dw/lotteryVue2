<template>
    <div class="gr_game-controller  gr_container  u_clearfix  bg_primary">
        <div class="gr_game-controller__inner">
            <div class="counter">
                <el-select ref="select" v-model="times">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input-number type="tel" @focus="handleFocus" @blur="handleBlur" ref="InputNumber" v-model="times" :min="1" :max="99999999" size="small" />
            </div>
            <!-- {{$t("倍")}} -->
            {{$t('common_034')}}
            <el-radio-group :value="mode">
                <el-radio-button
                    v-for="(_mode, mi) in VN_modes"
                    :key="mi"
                    :label="_mode"
                    v-if="mi === 0 || !isGPI"
                    @click.native="mode = _mode"
                >
                    {{ (lang === 'cn') ? $t(modesCn[mi]) : _mode }}
                </el-radio-button>
            </el-radio-group>
            <!-- '奖金' -->
            <span class="u_p--l10">{{$t('common_038')}}︰
                <span>
                    {{formatNumber(hprize)}}
                </span>
            </span>
            <div class="gr_game-controller__row">
                <div class="gr_game-controller__total" v-if="!isShowDemo">
                    <!-- {{$t("注")}} path="{0} 元" -->
                    <strong>{{nums}}</strong>{{$t('common_033')}}
                    ，<i18n path="common_044" tag="span">
                        <strong place="0">{{ formatNumber(money) || 0 }}</strong>
                        <template place="1">{{currencySymbol}}</template>
                    </i18n>
                    <!-- <span>
                    盈利{0} 元
                    ，<i18n path="common_045" tag="span">
                        <strong place="0">{{ bonus }}</strong>
                        <template place="1">{{currencySymbol}}</template>
                    </i18n>
                    </span>-->
                </div>
                <div class="gr_game-controller__button-group">
                    <button
                        :class="['c_button--large', !isBlocked ? 'c_button--primary' : 'c_button--disabled']"
                        :disabled="isBlocked"
                        @click="add(7)"
                    >
                        <!-- "直接投注" : '本期停售'-->
                        <span class="c_button__text">{{$t((!isBlocked) ? "common_046" : "common_068")}}</span>
                    </button>
                    <button
                        class="c_button--secondary  c_button--large"
                        @click="add(1)"
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
import InputNumber from '@E/packages/input-number/index.js'
import Radio from '@E/packages/radio/index.js'
import RadioGroup from '@E/packages/radio-group/index.js'
import RadioButton from '@E/packages/radio-button/index.js'

export default {
    name: 'GameControlls',
    components: {
        [InputNumber.name]: InputNumber,
        [Radio.name]: Radio,
        [RadioGroup.name]: RadioGroup,
        [RadioButton.name]: RadioButton
    },
    data() {
        // 測試用
        // window.test = (num) => {
        //     [...Array(num)].forEach(() => {
        //         this.add(1, false)
        //     })
        // }
        return {
            options: [{
                value: 1,
                label: 1
            }, {
                value: 5,
                label: 5
            }, {
                value: 10,
                label: 10
            }, {
                value: 20,
                label: 20
            }, {
                value: 50,
                label: 50
            }, {
                value: 100,
                label: 100
            }, {
                value: 200,
                label: 200
            }, {
                value: 500,
                label: 500
            }],
            keyStatus: {},
            tempTimes: ''
        }
    },
    methods: {
        ...mapActions([
            _M.GAME_ORDER_VN_SUBMIT,
            _M.GAME_ORDER_VN_SUBMIT_BOX,
            _M.SET_SELECT_LOCK
        ]),
        handleFocus() {
            this[_M.SET_SELECT_LOCK](true)
            this.$refs.select.handleFocus()
        },
        handleBlur() {
            this[_M.SET_SELECT_LOCK](false)
        },
        add(type, playFn = true) {
            //type 7 快速投注
            //type 1 添加投注項
            return this.submitOrder((emptyTextAreaFn) => {
                const { showList: orderShowList, cityId, codes, times, issue, nums: orderNum, mode } = this.VN_gameOrder
                const showList2 = orderShowList.map((obj) => {
                    const { title, name, nums } = obj
                    const child = ['pl2', 'pl3'].includes(title) ? title : name
                    obj.methodId = this.VN_methodData[title][child][cityId]
                    obj.tNums = orderNum * nums
                    obj.money = (this.VN_stake * obj.tNums * (times || 1) * this.mode).strip()
                    obj.codes = codes
                    obj.scode_key = codes
                    obj.onePrice = this.VN_stake
                    obj.times = times || 1
                    obj.issue = issue
                    obj.cityId = cityId
                    obj.mode = this.VN_mode
                    obj.mode2 = mode
                    obj.pos = this.VN_cityArea[cityId]
                    return obj
                })
                const showList = type === 7 ? showList2 : this.getRpeatOrder(showList2)
                const payload = {
                    type,
                    showList,
                    ltMoneyAmout: showList.reduce((a, b) => a + b.money, 0).strip(),
                    ltProjectNum: showList.reduce((a, b) => a + b.tNums, 0).strip()
                }
                this[_M.GAME_ORDER_VN_SUBMIT](payload)
                const fn = {
                    1: emptyTextAreaFn,
                    7: () => this[_M.GAME_ORDER_VN_SUBMIT_BOX](true)
                }
                playFn && fn[type]({times: ''})
            })
        },
        getRpeatOrder(list) {
            let arr = [...this.VN_gameSubmit.showList]
            let isSame = false
            list.forEach((order) => {
                const {codes, issue, methodId, mode, times, money, mode2, tNums, onePrice} = order
                const key = codes + issue + methodId + mode
                // 暫存 keyMap
                if (this.keyStatus[key]) {
                    const index = arr.findIndex((obj) => {
                        const {codes, issue, methodId, mode} = obj
                        const key2 = codes + issue + methodId + mode
                        return key === key2
                    })
                    // 如果找到重複單則倍數及金額累加
                    if (index !== -1) {
                        isSame = true
                        arr[index].times = Math.min(arr[index].times + times, this.getMaxTimes(order))
                        arr[index].money = onePrice * arr[index].times * mode2 * tNums
                    // 添加
                    } else {
                        arr.push(order)
                    }
                // 沒重複單
                } else {
                    arr.push(order)
                    this.keyStatus[key] = true
                }
            })
            isSame && this.$msg(warnMessageBox({
                // 号码已在投注项内
                message: 'popup_022',
                // 您选择的号码已在投注项内，将直接进行倍数累加
                content: 'popup_023'
            }))
            return arr
        },
        submitOrder(submitMethod) {
            //注數為 0
            if (!this.VN_gameOrder.cityId) {
                this.$msg(warnMessageBox({
                    message: 'popup_131'
                }))
                return false
            } else if (this.nums < 1) {
                this.$msg(warnMessageBox({
                    message: 'popup_002',
                    // '号码选择不完整' : '请选择一个城市'
                    content: 'popup_003'
                }))
                return false
            } else if (this.maxTimes < 1) {
                this.$msg(warnMessageBox({
                    // 超过可投注金额
                    message: 'popup_139',
                    // 请尝试其他投注单位，或改选其他玩法。
                    content: 'popup_123'
                }))
                this[_M.GAME_ORDER_VN_SUBMIT]({type: 7, times: ''})
                return false
            } else if (this.maxTimes < this.times) {
                this.$msg(warnMessageBox({
                    // 超过最大倍数限制
                    message: 'popup_014',
                    // '您输入的倍数超过【{0}】玩法的最高倍数限制，系统将自动修改为最大可输入倍数'
                    content: this.$t('popup_015', { '0': this.VN_currentMethod })
                }))
                this[_M.GAME_ORDER_VN_SUBMIT]({type: 7, times: this.maxTimes})
                return false
            } else if (this.VN_gameOrder.nums > this.VN_maxbet) {
                // 是否超過最大投注項數目
                this.$msg(warnMessageBox({
                // '请勿超过5000组号码'
                    message: 'popup_140'
                }))
                return false
            }
            this.$root.$emit('beforeCheck', submitMethod)
            return true
        },
        floorSix(num) {
            return Math.floor(+num * 1000000) / 1000000
        },
        formatNumber(n) {
            return formatNumber(n)
        },
        getMaxTimes(order) {
            const key = this.VN_isLocal || order.pos
            return ~~(this.VN_limitBonus[key] / this.getHprize(order))
        },
        getHprize({pos, mode2, title}) {
            return ((this.VN_jsPrize[pos] || {})[title.toLowerCase()] || 0) * mode2
        }
    },
    props: {
        isBlocked: Boolean
    },
    computed: {
        ...mapGetters([
            'lotteryList2',
            'isShowDemo',
            'VN_gameOrder',
            'VN_gameSubmit',
            'VN_currentMethod',
            'currencySymbol',
            'VN_methodData',
            'VN_limitBonus',
            'VN_cityArea',
            'VN_isLocal',
            'VN_jsPrize',
            'VN_stake',
            'VN_modes',
            'VN_mode',
            'VN_pos',
            'isGPI',
            'lang',
            'VN_maxbet'
        ]),
        functionType() {
            return this.VN_isLocal
                ? this.lotteryList2[this.VN_isLocal].name
                : this.VN_pos
        },
        maxTimes() {
            const key = this.VN_isLocal || this.functionType
            return ~~(this.VN_limitBonus[key] / this.hprize)
        },
        // 注數
        nums() {
            const nums = this.showList.reduce((a, b) => a + b.nums, 0)
            const ans = (this.VN_gameOrder.nums || 0) * nums
            return ans
        },
        showList() {
            return this.VN_gameOrder.showList || []
        },
        money() {
            if (!this.VN_gameOrder.cityId) {
                return 0
            }
            const onePrice = +this.VN_stake || 1
            return parseFloat((this.nums * onePrice * this.mode * (this.times || 1)).toFixed(2))
        },
        bonus() {
            return 0
            // return formatNumber(this.floorSix(this.VN_gameOrder.bonus))
        },
        times: {
            set(times) {
                this[_M.GAME_ORDER_VN_SUBMIT]({type: 7, times})
                this.$nextTick(() => {
                    // 空值不處理
                    if (times === '') {
                    // 過濾非正整數及最大最小值
                    } else if (this.tempTimes !== times) {
                        times = isNaN(times) ? 0 : ~~+times
                        this.times = this.tempTimes = Math.max(Math.min(times, 99999999), 0)
                    }
                })
            },
            get() {
                return this.VN_gameOrder.times
            }
        },
        hprize() {
            return ((this.VN_jsPrize[this.VN_pos] || {})[this.VN_currentMethod.toLowerCase()] || 0) * this.mode
        },
        modesCn() {
            return [
                'common_035',
                'common_036',
                'common_037'
            ]
        },
        mode: {
            set(mode) {
                this[_M.GAME_ORDER_VN_SUBMIT]({ type: 7, mode })
            },
            get() {
                return this.VN_gameOrder.mode
            }
        }
    }
}
</script>
