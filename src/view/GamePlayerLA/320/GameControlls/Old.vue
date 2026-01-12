

<template>
    <div class="game_controlls container">
        <div class="u_clearfix" v-if="showGameBox">
            <div class="u_f--left game_controlls--text">
                <div>
                    <!-- 共{0}注 -->
                    <i18n path="common_073" tag="span">
                        <strong>{{ltProjectNum}}</strong>
                    </i18n>
                    <!-- 总计{0}元 -->
                    <i18n path="common_074" tag="span">
                        <strong place="0">{{ltMoneyAmout}}</strong>
                        <template place="1">{{currencySymbol}}</template>
                    </i18n>
                </div>
                <div>
                    <!-- 可用余额{0}元 -->
                    <span>
                        <i18n path="popup_011">
                            <strong place="0">{{balance}}</strong>
                        </i18n>
                    </span>
                </div>
            </div>
            <div class="u_f--right game_controlls--btn">
                 <button
                    class="c_button--primary"
                    @click="confirm()"
                >
                    <!-- '确认投注' -->
                    <span class="c_button__text">{{$t('common_076')}}</span>
                </button>
            </div>
        </div>
        <ul v-else>
            <li>
                <button class="c_button--default"  @click.stop="randomShowLotterys" v-show="false && showRandomBtn && !isShowClearControl && !isBlocked">
                    <i class="c_button__icon  i_ramdon" />
                    <span class="c_button__text">
                        <!-- {{$t("机选")}} -->
                        {{$t('common_124')}}
                    </span>
                </button>
            </li>
            <li>
                <button class="c_button--default" @click.stop="reset" >
                    <i class="c_button__icon  i_clear" />
                    <span class="c_button__text">
                        <!-- {{$t("清空")}} -->
                        {{$t('common_049')}}
                    </span>
                </button>
            </li>
            <li>
                <button class="c_button--secondary" v-show="(!LA_gameSelectDataArr.length || isBlocked) && boxLength > 0" @click.stop="handleGameBox">
                    <i class="c_button__icon i_betting--320"></i>
                    <span class="c_button__text">
                        <!-- {{$t("查看投注项")}} -->
                        {{$t('common_123')}}
                    </span>
                    <div v-show="boxLength > 0"><span>{{boxLength > 9 ? 9 : boxLength}}</span><span v-if="boxLength > 9">+</span></div>
                </button>
            </li>
            <li>
                <button class="c_button--secondary" v-show="LA_gameSelectDataArr.length && !isBlocked" @click.stop="add">
                    <i class="c_button__icon  el-icon-plus" />
                    <span class="c_button__text">
                        <!-- {{$t("投注项")}} -->
                        {{$t('common_138')}}
                    </span>
                    <div v-show="boxLength > 0"><span>{{boxLength > 9 ? 9 : boxLength}}</span><span v-if="boxLength > 9">+</span></div>
                </button>
            </li>
            <li>
                <button
                    :class="[!isBlocked ? 'c_button--primary' : 'c_button--disabled', isFastDisabled]"
                    @click="(!isFastDisabled && LA_gameSelectDataArr.length) && fast()"
                >
					<!-- {{$t("直接投注")}} : '本期停售'-->
                    <span class="c_button__text">{{$t((!isBlocked) ? "common_046" : "common_068")}}</span>
                </button>
            </li>
        </ul>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
.game_controlls {
    width: 100%;
    min-height: 47px;
    background: backgrounds(secondary);
    border-top: 1px solid border_color(primary);
    font-size: 0;
    display: block;
    float: left;
    transition: all 0.3s ease;
    & ul {
        padding: 5.5px 10px 7.5px 10px;
    }
    & li {
        display: inline-block;
        & + li + li {
            float: right;
            margin-left: 10px;
            & button {
                min-width: 55px;
                padding: 7px 9px;
                @include multi-lang {
                    font-size: 13px;
                }
                & .i_betting {
                    width: 19px;
                    height: 19px;
                }
            }
        }
        &:first-child,
        &:nth-child(2) {
            & button {
                min-width: 55px;
                padding: 7px;
            }
        }
        &.disable {
            color: text_color(weak);
        }
        & div {
            @include circle(20px);
            background: $color_strong;
            color: text_color(default_invert);
            font-size: 10px;
            line-height: 20px;
            position: absolute;
            top: -8px;
            right: 0;
            text-align: center;
            transform: translateX(50%);
            z-index: 2;
        }
    }
    & > div {
        font-size: $font_size_small;
        line-height: 16px;
        padding: 5.5px 20px 7.5px 10px;
        position: relative;
        & button {
            padding: 7px
        }
        & .game_controlls--text {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            @include multi-lang {
                    width: calc(100% - 132px);
                & > div,& > div span {
                    display: block;
                    float:left;
                    width: 100%;
                }
            }
        }
        & .game_controlls--btn{
            @include multi-lang {
                height: 47px;
                & button{
                    top: 50%;
                    transform: translateY(-50%)
                }
            }
        }
    }
}
</style>
<script>
import GameControlls from '../../980/GameControlls/Old'
import { formatNumber } from '@UTIL'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'GameControlls',
    mixins: [GameControlls],
    data() {
        return {
            // isShowGameBox: false
            orderSource: 'gameSubmit',
            isFetching: false
        }
    },
    props: {
        handleGameBox: Function,
        showGameBox: Boolean
    },
    methods: {
        ...mapActions([
            _M.SET_LA_TEMP_DATA,
            _M.GAME_ORDER_LA_SUBMIT
        ]),
        //確認投注
        async confirm() {
            const errorCode = await this[_M.GAME_ORDER_LA_SUBMIT]({instance: this})
            if (errorCode === 0) {
                this.$root.$emit('back')
            }
        },
        //快速投注
        fast() {
            const userBouns = this.LA_nowPrize * this.LA_money
            if (userBouns > this.LA_bonus_limit) {
                return this.showLimitAlert()
            }
            this[_M.GAME_ORDER_LA_SUBMIT]({instance: this, fast: true})
        },
        reset() {
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
            'availableBalance',
            'lang',
            'currencySymbol',
            'LA_gameOrder',
            'LA_gameOrderArr',
            'LA_gameOrderMoney',
            'LA_gameSelectDataArr',
            'LA_ltMoneyAmout'
        ]),
        boxLength() {
            return (this.LA_gameOrderArr || []).length
        },
        ltProjectNum() {
            return this.boxLength
        },
        balance() {
            return formatNumber(this.availableBalance) || '0'
        },
        ltMoneyAmout() {
            return formatNumber(this.LA_gameOrderMoney)
        },
        isShowClearControl() {
            return !this.LA_gameOrderArr.length
        },
        isFastDisabled() {
            return this.LA_gameSelectDataArr.length ? null : 'c_button--disabled'
        }
    }
}
</script>