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
.gr_game-statistics__inner {
    padding: 0 10px;
}
.c_input--short {
    width: 82px;
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
// import { formatNumber } from '@UTIL'
export default {
    name: 'GameStatistics',
    props: {
        showGameBox: Boolean
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
        }
    }

}
</script>
