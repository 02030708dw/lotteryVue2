

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
                        <strong>{{ltMoneyAmout}}</strong>
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
                <button class="c_button--default" @click="reset">
                    <i class="c_button__icon  i_clear" />
                    <span class="c_button__text">
                        <!-- '清空' (中文以外不顯示文字)  -->
                        {{$t('common_049')}}
                    </span>
                </button>
            </li>
            <li class="ltBtn">
                <strong v-if="ltProjectNum" >{{ltProjectNum}}</strong>
                <button
                    :class="`c_button--${ltProjectNum ? 'primary' : 'disabled'}`"
                    :disabled="!ltProjectNum"
                    @click="submit"
                >
					<!-- '立即投注'-->
                    <span class="c_button__text">{{$t('common_046')}}</span>
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
    position: relative;
    > div {
        font-size: 12px;
        line-height: 16px;
        padding: 5.5px 20px 7.5px 10px;
        .game_controlls--text {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: calc(100% - 132px);
            > div, > div span {
                @include multi-lang {
                    display: block;
                    float: left;
                    width: 100%;
                }
            }
        }
        .game_controlls--btn {
            @include multi-lang {
                height: 47px;
                [class*="c_button--"] {
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
    }
    & ul {
        padding: 5.5px 10px 7.5px 10px;
    }
    & li {
        display: inline-block;
        &.ltBtn {
            position: relative;
            > strong {
                height: 23px;
                min-width: 23px;
                line-height: 23px;
                text-align: center;
                position: absolute;
                display: block;
                z-index: 3;
                background: #c1272d;
                color: #ffffff;
                font-size: 12px;
                border-radius: 50px;
                top: -10px;
                right: -7px;
            }
        }
        & + li ,& + li + li {
            float: right;
            margin-left: 10px;
        }
        &:nth-child(2) {
            & button {
                min-width: 100px;
                padding: 7px;
            }
        }
        &.disable {
            color: text_color(weak);
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
            _M.SET_TH_TEMP_DATA,
            _M.GAME_ORDER_TH_SUBMIT
        ]),
        //直接投注
        submit() {
            this.handleGameBox()
        },
        //確認投注
        async confirm() {
            const errorCode = await this[_M.GAME_ORDER_TH_SUBMIT](this)
            if (errorCode === 0) {
                this.$root.$emit('back')
            }
        },
        reset() {
            this[_M.SET_TH_TEMP_DATA]({
                temp: 'TH_gameSelectData',
                data: {}
            })
        }
    },
    computed: {
        ...mapGetters([
            'isShowDemo',
            'availableBalance',
            'lang',
            'TH_gameSelectDataArr',
            'TH_ltMoneyAmout',
            'currencySymbol'
        ]),
        ltProjectNum() {
            return this.TH_gameSelectDataArr.length
        },
        balance() {
            return formatNumber(this.availableBalance) || '0'
        },
        ltMoneyAmout() {
            return formatNumber(this.TH_ltMoneyAmout)
        }
    }
}
</script>