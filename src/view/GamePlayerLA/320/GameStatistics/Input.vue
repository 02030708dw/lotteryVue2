<template>
    <div class="gr_game-statistics  gr_container">
        <div class="gr_game-statistics__inner  u_clearfix" >
            <div class="u_f--left" v-show="!showGameBox">
                <el-input
                    class="short"
                    type="tel"
                    v-model="times"
                    :placeholder='$t("common_085")'
                    @click.native="handleClick"
                />
                <!-- {{$t("倍")}} -->
				<span class="u_f--right">&nbsp;{{$t('common_034')}}</span>
            </div>
            <div class="gr_game-statistics__mode" v-show="!showGameBox">
                <div class="c_select" :class="{ is_active: one_active }">
                    <input
                        v-for="(_mode, mi) in VN_modes"
                        :key="mi"
                        v-if="mi === 0 || !isGPI"
                        :checked="mode === _mode"
                        :id="'c_select__input' + (mi + 1)"
                        :value="mi + 1"
                        @click="mode = _mode"
                        class="c_select__input"
                        type="radio"
                        name="option"
                    >
                    <div class="c_select__option-group">
                        <label
                            class="c_option-group__item"
                            :for="'c_select__input' + (mi + 1)"
                            v-for="(_mode, mi) in VN_modes"
                            :key="mi"
                            v-if="mi === 0 || !isGPI"
                        >
						    <!-- {{$t("元 角 分")}} -->
                            {{ (lang === 'cn') ? $t(modesCn[mi]) : _mode }}
                        </label>
                    </div>
                    <!-- <div id="menuList" class="c_select__checked" @click="one_active = !one_active">{{ this.unit }}</div> -->
                    <div
                        ref="menuList"
                        class="c_select__checked"
                        @click="one_active = !one_active"
                    >
                        {{ $t(this.unit) }}
                    </div>
                </div>
            </div>
            <span class="u_f--right">
                {{$t('common_038')}}︰{{hprize}}
            </span>
        </div>
        <div class="gr_game-statistics__total" v-show="!showGameBox">
			<!-- {{$t("注")}} -->
            <span><strong>{{nums}}</strong>{{$t('common_033')}}</span>
			<!-- '{0} 元' -->
            ，<i18n path="common_044" v-if="!isShowDemo">
                <strong>{{money}}</strong>
            </i18n>
            <!--
            <span>
				'盈利{0} 元'
                ，<i18n path="common_045" tag="span">
                    <strong place="0">{{ bonus }}</strong>
                    <template place="1">{{currencySymbol}}</template>
                </i18n>
            </span>
             -->
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
    // position: fixed;
    // bottom: 47px;
    // left: 0;
    // z-index: 50;
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
.gr_game-statistics__mode {
    float: left;
    margin: 0 0 0 3px;
}
.gr_game-statistics__trace-stop {
    @include multi-lang {
        line-height: 32px;
        width: 100%;
    }
}
.c_slider {
    line-height: 20px;
}
.c_slider /deep/ .c_slider-point {
    display: block;
    margin: 0;
    text-align: left;
}
.c_slider /deep/ .c_slider-bar__tooltip {
    min-width: 120px;
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import { formatNumber } from '@UTIL'

export default {
    name: 'GameStatistics',
    components: {
    },
    data() {
        return {
            one_active: false
        }
    },
    props: {
        showGameBox: Boolean
    },
    mounted() {
        window.document.body.onclick = () => {
            this.one_active = false
        }
        this.$refs.menuList.addEventListener('click', e => e.stopPropagation(), true)
        // 980倍數為1切到320時清空倍數
        ;(+this.times) < 2 && (this.times = '')
    },
    methods: {
        ...mapActions([
            _M.GAME_ORDER_VN_SUBMIT
        ]),
        handleTimesChange(value) {
            // this[_M.ORDER_FUTURE_MULTIPLE_ALL](value)
            // this[_M.SET_ORDER_FUTURE]()
        },
        formatNumber(number) {
            return formatNumber(parseFloat(number))
        },
        handleClick(e) {
            // e.target.select()
            e.target.setSelectionRange(0, e.target.value.length)
            e.target.focus()
        },
        floorSix(num) {
            return Math.floor(+num * 1000000) / 1000000
        }
    },
    computed: {
        ...mapGetters([
            'VN_gameOrder',
            'VN_gameSubmit',
            'VN_jsPrize',
            'VN_stake',
            'VN_pos',
            'VN_currentMethod',
            'isShowDemo',
            'lang',
            'isShowBar',
            'isDev',
            'VN_modes',
            'VN_mode',
            'isGPI'
        ]),
        times: {
            set(times) {
                this[_M.GAME_ORDER_VN_SUBMIT]({type: 7, times})
                this.$nextTick(() => {
                    // 空值不處理
                    if (times === '') {
                    // 過濾非正整數及最大最小值
                    } else if (isNaN(times)) {
                        this.times = 0
                    } else {
                        const val = ~~+times
                        if (val < 0 || val > 99999999) {
                            this.times = Math.max(Math.min(val, 99999999), 0)
                        } else if (/[.-]/.test(times + '')) {
                            this.times = val
                        }
                    }
                })
            },
            get() {
                return this.VN_gameOrder.times
            }
        },
        money() {
            if (!this.VN_gameOrder.cityId) {
                return 0
            }
            const onePrice = +this.VN_stake || 1
            return parseFloat((this.nums * onePrice * this.mode * (this.times || 1)).toFixed(2))
        },
        nums() {
            const nums = this.showList.reduce((a, b) => a + b.nums || 0, 0)
            return (this.VN_gameOrder.nums || 0) * nums
        },
        showList() {
            return this.VN_gameOrder.showList || []
        },
        /** 計算浮動獎金組 */
        hprize() {
            return formatNumber(((this.VN_jsPrize[this.VN_pos] || {})[this.VN_currentMethod.toLowerCase()] || 0) * this.mode)
        },
        bonus() {
            // return formatNumber(this.floorSix(this.VN_gameOrder.bonus))
            return 0
        },
        modesCn() {
            // 元/角/分
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
        },
        unit() {
            // '元'/'角'/'分'
            const obj = {
                '1': 'common_035',
                '0.1': 'common_036',
                '0.01': 'common_037'
            }
            return obj[this.mode]
        }
    }
}
</script>
