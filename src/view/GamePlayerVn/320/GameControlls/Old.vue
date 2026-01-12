

<template>
    <div class="game_controlls container">
        <div class="u_clearfix" v-if="showGameBox">
            <div class="u_f--left game_controlls--text">
                <!-- 共{0}注 -->
                <i18n path="common_073" tag="span">
                    <strong>{{totalNum}}</strong>
                </i18n>
                <!-- 总计{0}元 -->
                <i18n path="common_074" tag="span">
                    <strong place="0">{{ltMoneyAmout}}</strong>
                    <span style="margin-right:0;" place="1">{{currencySymbol}}</span>
                </i18n>
                <!-- 可用余额{0}元 -->
                <span>
                    <i18n path="popup_011">
                        <strong place="0">{{balance}}</strong>
                    </i18n>
                </span>

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
                <button class="c_button--default" @click="reset">
                    <i class="c_button__icon  i_clear" />
                    <span class="c_button__text">
                        <!-- '清空' (中文以外不顯示文字)  -->
                        {{$t('common_049')}}
                    </span>
                </button>
            </li>
            <li>
                <button :class="`c_button--${VN_gameAreaMoney ? 'primary' : 'disabled'}`" @click="submit()">
					<!-- '直接投注'-->
                    <span class="c_button__text">{{$t('common_046')}}</span>
                </button>
                <button
                    class="c_button--secondary"
                    v-if="VN_gameAreaMoney && orderRowNum < 20 && VN_subMenuIndex < 2"
                    @click="add()"
                >
                    <i class="c_button__icon  el-icon-plus" />
                    <span class="c_button__text">
                        <!-- "投注项" (僅中文) -->
                        {{$t('common_138')}}
                    </span>
                    <div v-if="showListLength"><span>{{orderNum}}</span></div>
                </button>
                <button
                    class="c_button--secondary"
                    v-if="((!VN_gameAreaMoney && showListLength) || orderRowNum === 20) && VN_subMenuIndex < 2"
                    @click="setIsFast(false);handleGameBox(VN_gameOrder.showList)"
                >
                    <i class="c_button__icon i_betting--320"></i>
                    <span class="c_button__text">
                        <!-- {{$t("查看投注项")}} -->
                        {{$t('common_123')}}
                    </span>
                    <div><span>{{orderNum}}</span></div>
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
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // z-index: 50;
    display: block;
    float: left;
    transition: all 0.3s ease;
    & ul {
        padding: 5.5px 10px 7.5px 10px;
    }
    & li {
        display: inline-block;
        & + li ,& + li + li {
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
                //     & .i_clear {
                //         width: 12px;
                //     }
            }
            @include multi-lang {
                & button {
                // min-width: 35px;
                // padding: 7px 5px;
                //     & span {
                //         display: none;
                //     }
                }
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
            & span {
                margin-right: 5px;
                & strong {
                    padding: 0 1px;
                }
                &:last-child {
                    display: block;
                }
            }
            @include multi-lang {
                    width: calc(100% - 132px);
                & > span,& > div span {
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
        showGameBox: Boolean,
        setIsFast: Function,
        isFast: Boolean
    },
    methods: {
        ...mapActions([
            _M.MOBILE_GAME_ORDER_VN_SUBMIT_BOX,
            _M.GAME_ORDER_VN_SUBMIT,
            _M.FILTER_NUMBER_VN
        ]),
        //直接投注
        submit(fn = this.handleGameBox) {
            this.orderSource = 'gameSubmit'
            if (this.VN_gameAreaMoney) {
                this.setIsFast(true)
                this.$root.$emit('beforeCheck', {fn, fast: false, firstExecFn: true})
            }
        },
        //確認投注
        async confirm() {
            if (this.stopNumberFilter.length) {
                return this[_M.FILTER_NUMBER_VN]()
            }
            if (!this.isFetching) {
                this.isFetching = true
                const errorCode = await this[_M.MOBILE_GAME_ORDER_VN_SUBMIT_BOX](this.orderSource)
                this.isFetching = false
                if (errorCode === 0) {
                    !this.isFast && this[_M.GAME_ORDER_VN_SUBMIT]({type: 5})
                    this.$root.$emit('reset')
                    this.$parent.$parent.back()
                }
            }
        },
        add(fn = this.reset) {
            this.orderSource = 'gameOrder'
            this.$root.$emit('beforeCheck', {fn, type: 3})
        },
        reset() {
            this.$root.$emit('reset')
        }
    },
    computed: {
        ...mapGetters([
            'isShowDemo',
            'currencySymbol',
            'VN_gameAreaMoney',
            'VN_gameSubmit',
            'VN_gameOrder',
            'VN_subMenuIndex',
            'availableBalance',
            'VN_stopNumberCalc',
            'lang'
        ]),
        gameData() {
            return this.isFast ? this.VN_gameSubmit : this.VN_gameOrder
        },
        showList() {
            return this.gameData.showList
        },
        stopNumberFilter() {
            return this.showList.filter(({cityId, methodId, issue, codes}) => {
                if (this.VN_stopNumberCalc[`${cityId}_${issue}_${methodId}`]) {
                    let bool = false
                    this.VN_stopNumberCalc[`${cityId}_${issue}_${methodId}`].forEach((code) => {
                        if (codes.includes(code)) {
                            bool = true
                        }
                    })
                    return bool
                } else {
                    return false
                }
            })
        },
        orderNum() {
            return this.VN_gameOrder.showList.length
        },
        orderRowNum() {
            return this.VN_gameOrder.orderRowNum
        },
        showListLength() {
            return this.VN_gameOrder.showList.length
        },
        balance() {
            return formatNumber(this.availableBalance) || '0'
        },
        ltMoneyAmout() {
            return formatNumber(this.gameData.ltMoneyAmout)
        },
        order() {
            return this.gameData.order
        },
        totalNum() {
            return this.gameData.showList.reduce((val, {nums}) => (val + nums), 0)
        }
    }
}
</script>