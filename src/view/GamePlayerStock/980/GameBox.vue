<template>
    <div class="gr_container  bg_accent  u_clearfix">
        <div class="header u_clearfix">
            <i class="i_betting--980"></i>
            <span class="header__title">
                <!-- {{$t("投注项")}} -->
                {{$t('common_047')}}
            </span>
            <div class="area_btn">
                <button class="c_button--default" @click="handleEmpty">
                    <i class="c_button__icon  i_clear" />
                    <span class="c_button__text">
                        <!-- {{$t("清空")}} -->
                        {{$t('common_049')}}
                    </span>
                </button>
                <button class="c_button--default" @click="randomLotterys(1)" v-if="!isBlocked">
                    <i class="c_button__icon  i_ramdon" />
                    <span class="c_button__text">
                        <!-- {{$t("机选1注")}} -->
                        {{$t('common_070')}}
                    </span>
                </button>
                <button class="c_button--default" @click="randomLotterys(5)" v-if="!isBlocked">
                    <i class="c_button__icon  i_ramdon" />
                    <span class="c_button__text">
                        <!-- {{$t("机选5注")}} -->
                        {{$t('common_071')}}
                    </span>
                </button>
            </div>
        </div>
        <div class="content bg_secondary_light">
            <div class="content_inner">
                <div class="list u_clearfix" v-for='(item, index) in ltProject' @click.stop.prevent="handleReSelect(index)">
                    <div>
                        <span>#{{item.issue}}</span>
                        <span :class="(item.isOver) ? 'text_color_strong': ''">[{{showMethodName(item.parentName, item.childNameKey)}}]</span>
                        <strong><span v-html="textFixed(item.showCodes)" class="betting_detail" /></span></strong>
                        <span>@{{item.hprize}}</span>
                    </div>
                    <div class="c_input--long c_input--inline">
                        <input type="text"
                            class="c_input__inner  u_t--center"
                            v-model="moneyTempArr[index]"
                            @blur="handleBlur($event, index)"
                            v-clean-input:int.long="{val: moneyTempArr[index], setVal: setMoneyTemp(index), cb: afterCleanInput(index)}"
                        >
                        <a href="javascript: void(0)" @click.stop.prevent="handleRemove(index)" ><i class="el-icon-close" /></a>
                    </div>
                </div>
            </div>
        </div>

        <div class="controls_total" v-show="ltProjectNum > 0">
            <!-- 共{0}注 -->
            <i18n path="common_073">
                <strong place="0">{{ formatNumber(ltProjectNum) }}</strong>
            </i18n>
            <!-- 总计{0}元 -->
            <i18n v-if="!isShowDemo" path="common_074" tag="span">
                <strong place="0">{{ltMoneyAmout}}</strong>
                <template place="1">{{currencySymbol}}</template>
            </i18n>
            <button class="c_button--primary  c_button--large" @click="handleGameOrder" v-if="!allIsBlocked">
                <div class="c_button__text">
                    <!-- {{$t("确认投注")}} -->
                    {{$t('common_076')}}
                </div>
                <div class="c_button__text">
                    <span>
                        <!-- {{$t("截止时间")}} -->
                        {{$t('common_077')}}
                    </span>
                    <span>{{getCodeTime}}</span>
                </div>
            </button>
            <button class="c_button--disabled  c_button--large" v-else>
                <!-- 本期停售 -->
                < class="c_button__text">{{$t('common_068')}}</>
            </button>
        </div>

    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
.gr_container {
    padding: 27px 20px 20px;
    position: relative;
    & .header {
        line-height: 29px;
        margin-bottom: 10px;
        & .header__title {
            display: inline-block;
            font-size: $font_size_large;
            font-weight: bold;
            vertical-align: middle;
        }
    }
    & .area_btn {
        float: right;
    }
    & .content {
        @extend %shadow_linear_gradient_default;
        border: 1px solid border_color(dark);
        font-size: $font_size_small;
        padding: 5px;
        & .content_inner {
            height: 170px;
            overflow-y: scroll;
            & .list {
                border-bottom: 1px solid border_color(light);
                padding-left: 15px;
                & > div {
                    float: left;
                    line-height: 23px;
                    padding: 5px 0;
                    & + div {
                        float: right;
                        & span {
                            border-left: 1px solid border_color(light);
                            padding: 0 10px;
                        }
                        & .hprize {
                            border: none;
                            padding: 0;
                        }
                        & i {
                            color: lighten($color_default, 70%);
                            padding-right: 15px;
                        }
                    }
                }
                &.active,
                &.active:hover {
                    background: backgrounds(secondary_heavy);
                    & i {
                        color: lighten($color_secondary, 7.5%);
                    }
                }
                &:hover {
                    background: backgrounds(secondary);
                }
                & .show_detail {
                    display: inline;
                    position: relative;
                    & .list_detail {
                        background: backgrounds(primary);
                        border: 1px solid border_color(primary_dark);
                        min-width: 140px;
                        position: absolute;
                        top: 0;
                        left: 120%;
                        z-index: 1;
                        & .list_detail_title {
                            padding: 0 35px 0 10px;
                            position: relative;
                            white-space: nowrap;
                        }
                        & .list_detail_inner {
                            line-height: 20px;
                            margin: 5px;
                            max-height: 120px;
                            max-width: 320px;
                            overflow: auto;
                        }
                        & i {
                            cursor: pointer;
                            position: absolute;
                            top: 50%;
                            right: 10px;
                            transform: translateY(-50%);
                        }
                    }
                }
                /deep/ .betting_detail span {
                    margin: 0 2px;
                    &.sy {
                        margin: 0 5px;
                    }
                }
            }
        }
    }
    & .controls_total {
        float: right;
        line-height: 47px;
        padding: 15px 0 0 15px;
        text-align: right;
        & > span + span {
            padding: 0 0 0 15px;
        }
        & button {
            font-size: 0;
            float: right;
            margin-left: 15px;
            & div {
                display: inline-block;
                font-size: $font_size_xlarge;
                vertical-align: middle;
                & + div {
                    border-left: 1px solid $color_default_invert;
                    font-size: $font_size_small;
                    margin-left: 8px;
                    padding-left: 8px;
                }
                & span {
                    display: block;
                    line-height: 14px;
                }
            }
            & > span {
                font-size: $font_size_large;
            }
        }
    }
    & .controls_total--narrow {
        padding: 0;
    }
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import { formatNumber } from '@UTIL'
import { methodNameKey } from '@UTIL/presenter'

export default {
    name: 'GameBox',
    data() {
        return {
            moneyTempArr: [],
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
    beforeMount() {
        this.$root.$on('updateMoneyTemp', this.updateMoneyTemp)
        this.updateMoneyTemp()
    },
    beforeDestroy() {
        this.$root.$off('updateMoneyTemp', this.updateMoneyTemp)
    },
    watch: {
        // 注單數量變動時,同步初始化 moneyTempArr
        ltProjectNum() {
            this.updateMoneyTemp()
        }
    },
    computed: {
        ...mapGetters([
            'lang',
            'diffPrizeData',
            'game',
            'gameSubmit',
            'gameOrder',
            'isShowDemo',
            'gameMenuSub',
            'flipTimer',
            'allIsBlocked',
            'getGameOption',
            'onePrice',
            'currencySymbol',
            'codeTime',
            'currentjsDynamicData'
        ]),
        ...mapGetters({
            lotteryId: 'gameLotteryId',
            ltProject: 'gameLtProject'
        }),
        ltMoneyAmout() {
            return formatNumber(this.gameSubmit.ltMoneyAmout)
        },
        ltProjectNum() {
            return this.ltProject.length
        },
        // 取得雙獎期/單獎期的剩餘時間
        getCodeTime() {
            // 單獎期/無獎期
            if ((this.currentjsDynamicData.issue || []).length < 2) {
                return this.codeTime
            }

            // 雙獎期: 如果上下午都勾選,則顯示早上獎期, 否則依使用者勾選的時段
            const timerIdx = Object.keys(this.gameOrder.activeCheckboxes[0] || {})[0] || 0
            const {hours = '', minutes = '', seconds = ''} = (this.flipTimer.muti || [])[timerIdx] || {}
            let formatHour = hours
            if (hours[0] === '0') {
                formatHour = hours === '000' ? '' : hours.substr(1, 2) + ':'
            }
            return `${formatHour}${minutes}:${seconds}`
        }
    },
    methods: {
        ...mapActions([
            _M.REMOVE_SUBMIT_ORDER_INDEX,
            _M.REMOVE_SUBMIT_ALL_ORDER,
            _M.RE_SELECT_BALL,
            _M.GAME_ORDER_SUBMIT,
            _M.GAME_DETAIL_TOGGLE,
            _M.SET_GAME_LT_PROJECT,
            _M.REFRESH_SUBMIT_SUM
        ]),
        // 初始化 moneyTempArr
        updateMoneyTemp() {
            this.ltProject.forEach((oneProject, idx) => {
                if (this.moneyTempArr[idx] !== oneProject.money) {
                    this.moneyTempArr[idx] = oneProject.money
                    this.$set(this.moneyTempArr, idx, oneProject.money)
                }
            })
        },
        async handleReSelect(index) {
            // await this[_M.RE_SELECT_BALL](index)
            this.$router.replace(`/GamePlayerStock/${this.lotteryId}?sub=${this.gameOrder.typeName}`)
        },
        handleEmpty() {
            this[_M.REMOVE_SUBMIT_ALL_ORDER]()
            this.moneyTempArr = []
        },
        handleRemove(index) {
            this[_M.REMOVE_SUBMIT_ORDER_INDEX](index)
        },
        randomLotterys(num) {
            if (this.isBlocked) return
            this.$root.$emit('beforeRandomLotterys', num)
        },
        handleGameOrder() {
            // 檢查整個投注箱
            this.$root.$emit('beforeCheck', this[_M.GAME_ORDER_SUBMIT], ['checkBox'])
        },
        isDetail(index) {
            return this.game.isDetailIndex === index
        },
        textFixed(value) {
            return value.substr(0, 20).replace(/([,])/g, '<span>$1</span>').replace(/([|])/g, '<span class="sy">$1</span>')
        },
        textFixedSpan(value) {
            return value.replace(/([,])/g, '<span>$1</span>')
        },
        formatNumber(number) {
            return formatNumber(number)
        },
        showMethodName(pName, cKey) {
            return `${this.$t(this.keyObj[pName])} - ${this.$t(cKey)}`
        },
        /**
         * 設定moneyTempArr方法, 輸入不合法時觸發
         * @param idx 在ltProjectTemp裏頭的index
         * @param newMoney 欲設定的新money
         */
        setMoneyTemp(idx) {
            return (newMoney) => {
                this.$set(this.moneyTempArr, idx, newMoney)
            }
        },
        // 投注金額設定, 驗證完觸發
        afterCleanInput(idx) {
            return (newMoney) => {
                this[_M.SET_GAME_LT_PROJECT]({type: 5, index: idx, data: {money: +newMoney, onePrice: +newMoney}})
            }
        },
        // 投注金額檢查最小金額
        handleBlur(e, idx) {
            let newMoney = +e.target.value
            if (+newMoney < +this.onePrice) {
                newMoney = +this.onePrice
                this.$set(this.moneyTempArr, idx, newMoney)
            }
            this[_M.SET_GAME_LT_PROJECT]({type: 5, index: idx, data: {money: +newMoney, onePrice: +newMoney}})
            // 刷新金額
            this[_M.REFRESH_SUBMIT_SUM]()
        }
    }
}
</script>
