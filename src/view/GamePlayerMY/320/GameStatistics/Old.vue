<template>
    <div class="gr_game-statistics  gr_container" v-if="!showGameBox">
        <div class="gr_game-statistics__inner  u_clearfix" >
            <div class="u_f--left">
                <div class="c_input--short">
                    <!-- '投注金额' -->
                    <el-input
                        type="tel"
                        :placeholder="$t('common_061')"
                        v-model="money"
                        @blur="handleBlur"
                    />
                </div>
            </div>
            <!-- 奖金 -->
            <div style="float: right" >
                <span :class="{ is_strong: MY_prizeChange[MY_methodIsSelect[0]] }">
                    {{$t('common_038')}} ：{{formatNumber(MY_nowPrize)}}
                </span>
            </div>
        </div>
        <!-- 狀態列 -->
        <div class="gr_game-statistics__total" v-show="!showGameBox">
			<!-- {{$t("注")}} -->
            <span><strong>{{MY_gameSelectDataArr.length}}</strong>{{$t('common_033')}}</span>
			<!-- '{0} 元' -->
            ，<i18n path="common_044">
                <strong place="0">{{MY_gameSelectDataMoney}}</strong>
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
    &::before {
        height: 5px;
        opacity: 0.5;
    }

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
.gr_game-statistics__inner {
    padding: 0 10px;
}
.c_input--short {
    width: 82px;
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import { returnState, formatNumber } from '@UTIL'
export default {
    name: 'GameStatistics',
    props: {
        showGameBox: Boolean
    },
    watch: {
        MY_lotteryId (v) {
            v && (this.money = '')
        }
    },
    methods: {
        ...mapActions([
            _M.SET_MY_TEMP_DATA
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
        formatNumber(number) {
            return formatNumber(parseFloat(number))
        }
    },
    computed: {
        ...mapGetters([
            'MY_money',
            'MY_stake',
            'MY_nowPrize',
            'MY_lotteryId',
            'MY_prizeChange',
            'MY_methodIsSelect',
            'MY_gameSelectDataArr',
            'MY_gameSelectDataMoney',
            'currencySymbol'
        ]),
        money: {
            get() {
                return this.MY_money
            },
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
            }
        }
    }

}
</script>
