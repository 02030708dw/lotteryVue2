<template>
    <div class="gr_container bg_primary">
        <div class="header">
            <button class="c_button--default" @click="handleEmpty">
                <i class="c_button__icon  i_clear" />
                <span class="c_button__text">
                    <!-- '清空' -->
                    {{$t('common_049')}}
                </span>
            </button>
        </div>
        <div class="content bg_secondary_light">
            <div class="content_inner">
                <div class="list u_clearfix" v-for='(items, index) in showList' :key="index" >
                    <div
                        class="reSelectClick"
                    />
                    <div>
                        <span class="play_text">
                            <!-- 日期-城市 ex:04-05 平阳  -->
                            <span v-if="items.issue">{{transDate(items.issue)}} {{$t(VN_cityData[items.cityId])}}</span>
                            <!-- 玩法組和 ex:[3D-尾] -->
                            <span>[{{items.title.toUpperCase()}}-{{$t(items.title_key)}}]</span>
                        </span>
                        <!-- code ex: 123,456 -->
                        <span class="show_order" v-html="parseVNCode(items, { length: 20 })" />
                        <div class="show_detail" v-if="parseVNCode(items, { isHtml: false }).length > 20">
                            <a href="javascript: void(0)" class="text_color_accent_invert" @click.stop.prevent="open(index, $event)">
                                <!-- '详情' -->
                                {{$t('common_125')}}
                            </a>
                            <div class="list_detail shadow_linear" v-if="isOpen === index" :class="{ 'right': isBreakLine, 'left': !isBreakLine }">
                                <div class="bg_secondary_heavy">
                                    <!-- '共{0}注' -->
                                    {{$t("common_073", {'0': formatNumber(items.tNums)})}}
                                    <i class="el-icon-close" @click.stop.prevent="close" />
                                </div>
                                <div class="list_detail_inner">
                                    <p v-for="(code, index) in items.codes.split(',')" :key="index">
                                        {{code.replace(/&/g, ' , ')}}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span>{{formatNumber(items.tNums)}}
                            <!-- '注' -->
                            {{$t('common_033')}}
                        </span>,
                        <span>
                            <!-- '倍' -->
                            {{items.times}}{{$t('common_034')}}
                        </span>,
                        <span v-if="!isShowDemo">
                            <!-- '{0} 元' -->
                            {{$t("common_044", {'1': currencySymbol, '0': formatNumber(items.money)})}}
                        </span>
                        <a href="javascript: void(0)" @click.stop.prevent="handleRemove(index)" ><i class="el-icon-close" /></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';

$gr_header-height: 44px;
$gr_games-header-height: 67px;
$gr_game-statistics-height: 48px;
$gr_game-controlls: 47px;

.gr_container {
    padding: #{$gr_games-header-height + 10px} 15px 77px;
    & .header {
        line-height: 29px;
        margin-bottom: 10px;
        & button {
            width: calc(100% / 3 - 8px);
        }
    }
    & .content {
        border: 1px solid border_color(dark);
        font-size: $font_size_small;
        margin: 0 0 15px;
        padding: 5px 0;
        & .content_inner {
            height: calc(100vh - #{ $gr_header-height + $gr_games-header-height + $gr_game-statistics-height + $gr_game-controlls + 74px});
            overflow-y: scroll;
            & .list {
                border-color: border_color(light);
                border-bottom-style: solid;
                border-bottom-width: 1px;
                padding: 5px 35px 5px 15px;
                position: relative;
                & .reSelectClick{
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100px;
                    background: transparent;
                    cursor: pointer;
                }
                & .play_text {
                    width: 100%;
                    display: inline-block;
                }
                & strong {
                    padding-left: 0px;
                }
                & > div {
                    line-height: 22px;
                    & a i {
                        color: lighten($color_default, 70%);
                        height: 77px;
                        line-height: 77px;
                        text-align: center;
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 35px;
                    }
                }
                &.active {
                    background: backgrounds(secondary_heavy);
                    & i {
                        color: lighten($color_secondary, 7.5%);
                    }
                }
                & .show_order {
                    color: #fb8032;
                    display: inline-block;
                    height: 14px;
                    white-space: nowrap;
                    line-height: 14px;
                    vertical-align: text-bottom;
                }
                & .show_detail {
                    display: inline;
                    position: relative;
                    & a {
                      white-space: nowrap;
                    }
                    & .list_detail {
                        @include size(180px, 100px);
                        border: 1px solid border_color(primary_dark);
                        background: backgrounds(primary);
                        position: absolute;
                        top: 110%;
                        z-index: 1;
                        & div {
                            padding: 0 35px 0 10px;
                            position: relative;
                            white-space: nowrap;
                            & + div {
                                height: 70px;
                                overflow: auto;
                                padding: 0 10px;
                                word-wrap: break-word;
                            }
                        }
                        & i {
                            cursor: pointer;
                            position: absolute;
                            top: 50%;
                            right: 10px;
                            transform: translateY(-50%);
                        }

                        &.right {
                            right: 0;
                        }

                        &.left {
                            left: 0;
                        }
                    }
                }
            }
            @include multi-lang {
                $gr_game-statistics-height: 80px;
                $gr_game-controlls: 60px;
                height: calc(100vh - #{ $gr_header-height + $gr_games-header-height + $gr_game-statistics-height + $gr_game-controlls + 74px});
            }
        }
    }
}
</style>
<script>
import GameBox from '../../980/GameBox'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'GameBoxInput',
    extends: GameBox,
    data() {
        return {
            isBreakLine: false
        }
    },
    updated() {
        !this.ltProjectNum && this.$root.$emit('back')
    },
    methods: {
        ...mapActions([
            _M.SET_HEADER_NAV_IS_BACK
        ]),
        handleRemove(index) {
            this[_M.GAME_ORDER_VN_SUBMIT]({ type: 2, index })
        }
        // async handleReSelect(index) {
        //     if (this.isOpen !== -1) {
        //         return
        //     }
        //     this[_M.SET_GAME_SHOW_MODE](0)
        //     this[_M.SET_HEADER_NAV_IS_BACK](false)
        //     await this[_M.RE_SELECT_BALL](index)
        //     this.$router.replace(`/GamePlayer/${this.lotteryId}?sub=${this.gameOrder.typeName}`)
        //     this.$root.$emit('updateShowTimes', this.gameOrder.times)
        //     this.$root.$emit('onInputValue', (this.floatPrize.keepPoint * 100 - this.keepPoint).toFixed(1))
        // },
    },
    computed: {
        ...mapGetters([
            'VN_gameOrder',
            'currencySymbol'
        ])
    }
}
</script>
