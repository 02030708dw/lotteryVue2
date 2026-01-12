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
                <button class="c_button--default" @click="randomLotterys(1)" v-if="false">
                    <i class="c_button__icon  i_ramdon" />
                    <span class="c_button__text">
                        <!-- {{$t("机选1注")}} -->
                        {{$t('common_070')}}
                    </span>
                </button>
                <button class="c_button--default" @click="randomLotterys(5)" v-if="false">
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
                <div class="list u_clearfix" v-for='(item, index) in MY_gameOrderArr'>
                    <div>
                        <span :class="{text_color_strong: MY_over[item.methodId]}">[{{showMethodName(item.methodId)}}]</span>
                        <strong><span class="betting_detail" />{{item.codes}}</span></strong>
                        <span :class="{text_color_strong: MY_prizeChange[item.methodId]}">@{{item.hprize}}</span>
                    </div>
                    <div class="c_input--long c_input--inline">
                        <input type="text"
                            class="c_input__inner  u_t--center"
                            @input="setMoney(`${item.methodId}_${item.codes}`, $event.target.value, index)"
                            @blur="handleBlur(`${item.methodId}_${item.codes}`, index)"
                            :value="item.money"
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
            <button class="c_button--primary  c_button--large" @click="handleGameOrder" v-if="true">
                <div class="c_button__text">
                    <!-- {{$t("确认投注")}} -->
                    {{$t('common_076')}}
                </div>
                <div class="c_button__text">
                    <span>
                        <!-- {{$t("截止时间")}} -->
                        {{$t('common_077')}}
                    </span>
                    <span>{{MY_codeTime}}</span>
                </div>
            </button>
            <button class="c_button--disabled  c_button--large" v-else>
                <!-- 本期停售 -->
                <span class="c_button__text">{{$t('common_068')}}</span>
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
import BoxMixin from '@V/GamePlayerMY/components/BoxMixin'
export default {
    name: 'GameBox',
    mixins: [BoxMixin],
    data() {
        return {
            // moneyTempArr: []
        }
    },
    props: {
        isBlocked: Boolean
    },
    computed: {
        ...mapGetters([
            'currencySymbol',
            'isShowDemo',
            'MY_gameOrder',
            'MY_gameOrderArr',
            'MY_flipTimer',
            'MY_gameSubMenuObj',
            'MY_menuIndex',
            'MY_gameOrderMoney',
            'MY_codeTime',
            'MY_over',
            'MY_stake',
            'MY_prizeChange'
        ]),

        ltMoneyAmout() {
            return formatNumber(this.MY_gameOrderMoney)
        },
        ltProjectNum() {
            return this.MY_gameOrderArr.length
        }
    },
    methods: {
        ...mapActions([
            _M.SET_MY_TEMP_DATA,
            _M.GAME_ORDER_MY_SUBMIT
        ]),
        handleEmpty() {
            this[_M.SET_MY_TEMP_DATA]({
                temp: 'MY_gameOrder',
                data: {}
            })
        },
        handleGameOrder() {
            this[_M.GAME_ORDER_MY_SUBMIT]()
            // // 檢查整個投注箱
            // this.$root.$emit('beforeCheck', , ['checkBox'])
        }
    }
}
</script>
