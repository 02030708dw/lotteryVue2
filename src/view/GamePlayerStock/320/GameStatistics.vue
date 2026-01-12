<template>
    <div class="gr_game-statistics  gr_container">
        <div class="gr_game-statistics__inner  u_clearfix" >
            <div class="u_f--left" v-show="gameShowMode === 0">
                <div class="c_input--medium">
                    <!-- '投注金额' -->
                    <el-input
                        type="tel"
                        v-model="money"
                        :placeholder="$t('common_061')"
                        :disabled="isBlocked"
                        v-clean-input:int.long="{val: money, setVal: setMoney, cb: afterCleanInput}"
                        @blur="handleBlur"
                    />
                </div>
            </div>
			<!-- 奖金 -->
            <div style="float: right" v-show="gameShowMode === 0">
                <span :class="{ is_strong: prizeIsUpdated }">
                    {{$t('common_038')}} ：{{formatNumber(hprize)}}
                </span>
            </div>
        </div>
        <!-- 狀態列 -->
        <div class="gr_game-statistics__total" v-show="gameShowMode === 0">
			<!-- {{$t("注")}} -->
            <span><strong>{{gameOrder.nums}}</strong>{{$t('common_033')}}</span>
			<!-- '{0} 元' -->
            ，<i18n path="common_044">
                <strong place="0">{{getMoney}}</strong>
                <template place="1">{{currencySymbol}}</template>
            </i18n>
            <!-- '盈利{0} 元' -->
            <!-- <span>
                ，<i18n path="common_045" tag="span">
                    <strong place="0">{{ bonus || '0'}}</strong>
                    <template place="1">{{currencySymbol}}</template>
                </i18n>
            </span> -->
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';

$gr_game-statistics-height: 48px;

.gr_game-statistics {
    @extend %shadow_linear_gradient_dark_invert;
    background: rgba(backgrounds(primary), 0.8);
    font-size: $font_size_small;
    line-height: $gr_game-statistics-height;
    width: 100%;
    display: block;
    float: left;
    &::before {
        height: 5px;
        opacity: 0.5;
    }
    & [class*="el"].short {
        width: 60px;

        /deep/ .el-input__inner {
            text-align: center;
        }
    }
}
.gr_game-statistics__inner {
    padding: 0 10px;
}
.gr_game-statistics__inner p {
    padding: 0 0 0 5px;
}

.el-input {
    vertical-align: middle;
}

.gr_game-statistics__total {
    background: #e6e6e6;
    float: right;
    font-size: $font_size_small;
    line-height: 30px;
    text-align: right;
    padding: 0 10px;
    width: 100%;
}

</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import { formatNumber } from '@UTIL'

export default {
    name: 'GameStatistics',
    props: {
        isBlocked: Boolean
    },
    data() {
        return {
            money: ''
        }
    },
    computed: {
        ...mapGetters([
            'autoOdds',
            'game',
            'gameOrder',
            'gameShowMode',
            'jsPrizePoint',
            'config',
            'prizeIndex',
            'methodId',
            'lang',
            'currencySymbol',
            'prizeIsUpdated',
            'onePrice'
        ]),
        // 多獎金資料判斷目前顯示哪筆獎金組
        hprizeIndex() {
            const { hprizeIndex } = this.config || {}
            return hprizeIndex ? this.prizeIndex : 0
        },
        /** 計算浮動獎金組 */
        hprize() {
            return this.calcHprize(this.hprizeIndex)
        },
        // 顯示用總金額
        getMoney() {
            return this.gameOrder.money
        }
        // 狀態列顯示的金額X元
    },
    methods: {
        ...mapActions([
            _M.SET_GAME_ORDER_DATA
        ]),
        formatNumber(number) {
            return formatNumber(parseFloat(number))
        },
        getHprize(index) {
            return this.jsPrizePoint[this.gameOrder.methodId][index]
        },
        calcHprize(index) {
            try {
                const { hprize, autoOdds } = this.getHprize(index)
                return ((+hprize + autoOdds)).strip()
            } catch (error) {
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
    }
}
</script>
