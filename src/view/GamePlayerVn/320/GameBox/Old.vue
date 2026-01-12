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
                <div class="list u_clearfix" :class="[{stop: hasStop(items)},isStopClass(items.methodId, items.cityId, items.issue)]" v-for='(items, index) in showList' :key="index" >
                    <div
                        class="reSelectClick"
                    />
                    <div>
                        <span class="play_text">
                            <!-- 日期-城市 ex:04-05 平阳  -->
                            <span v-if="items.issue">{{transDate(items.issue)}} {{$t(VN_cityData[items.cityId])}}</span>
                            <!-- 玩法組和 ex:[3D-尾] -->
                            <span>[{{$t(items.method_key)}}-{{$t(items.methodNameKey)}}]</span>
                        </span>
                        <!-- code ex: 123,456 -->
                        <span class="show_order" >
                            {{items.scode_key.filter ? items.scode_key.filter(c => c).join(',') : $t(items.scode_key)}}
                        </span>
                    </div>
                    <div>
                        <span>{{formatNumber(items.nums)}}
                            <!-- '注' -->
                            {{$t('common_033')}}
                        </span>,
                        <span v-if="!isShowDemo">
                            <!-- '{0} 元' -->
                            {{$t("common_044", {'1': currencySymbol, '0': formatNumber(items.onePrice)})}}
                        </span>,
                        <span v-if="!isShowDemo">
                            <!-- '总额' '{0}元' -->
                            {{$t('popup_117')}} {{$t("common_044", {'1': currencySymbol, '0': formatNumber(items.money)})}}
                        </span>
                        <a href="javascript: void(0)" @click.stop.prevent="handleRemove(index)" ><i class="el-icon-close" /></a>
                    </div>
                </div>
            </div>
        </div>
            <!-- 注意：您有投注到已停售或超过投注限额的玩法，请协助移除。 -->
        <p class="u_clearfix is_strong" v-show="isStop">{{$t('popup_154')}}</p>
        <!-- 注意：您有投注到已关闭的彩种或玩法，请协助移除。 -->
        <p class="u_clearfix is_strong" v-show="isBlocked">{{$t('popup_153')}}</p>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';

$gr_header-height: 44px;
$gr_games-header-height: 67px;
$gr_game-statistics-height: 48px;
$gr_game-controlls: 47px;

.gr_container {
    padding: #{$gr_games-header-height + 10px} 15px;
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
            & .stop {
                background: #fecacb;
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
import { formatNumber } from '@UTIL'
import GameBox from '../../980/GameBox'
import { mapGetters, mapActions } from 'vuex'
import { parseVNCode } from '@UTIL/presenter'
export default {
    name: 'GameBoxOld',
    extends: GameBox,
    data() {
        return {
            tableTitle: [
                'vn_t_018', // 头
                'vn_t_019', // 尾
                'vn_t_020', // 头尾
                'vn_t_021', // 包组
                'vn_t_022' // 包组7
            ]
        }
    },
    updated() {
        this.showList.length < 1 && this.$root.$emit('back')
    },
    props: {
        isFast: Boolean
    },
    computed: {
        ...mapGetters([
            'isShowDemo',
            'VN_nowStopId',
            'VN_gameSubmit',
            'VN_gameOrder',
            'availableBalance',
            'lotteryMenu',
            'VN_cityData',
            'VN_localIssue',
            'VN_week',
            'currencySymbol',
            'VN_isLocal',
            'VN_StopNumberFilter'
        ]),
        gameData() {
            return this.isFast ? this.VN_gameSubmit : this.VN_gameOrder
        },
        balance() {
            return formatNumber(this.availableBalance) || '0'
        },
        showList() {
            return this.gameData.showList
        },
        order() {
            return this.gameData.order
        }
    },
    methods: {
        ...mapActions([
            _M.GAME_ORDER_VN_SUBMIT_REMOVE,
            _M.FILTER_NUMBER_VN
        ]),
        handleRemove(i) {
            // const order = this.gameData.showList[i]
            this[_M.GAME_ORDER_VN_SUBMIT_REMOVE]({index: i, isFast: this.isFast})
        },
        transIssue(data) {
            const date = moment(data)
            return `${date.format('MM-DD')} (${this.$t(this.VN_week[date.day()])})`
        },
        totalNum() {
            let num = 0
            this.gameData.showList.forEach(({id, issue}) => (num += this.order[id][`count${issue}`]))
            return num
        },
        handleEmpty() {
            const obj = this.isFast ? { type: 8 } : { type: 7, showList: [], orderRowNum: 0 }
            this[_M.GAME_ORDER_VN_SUBMIT](obj)
        }
    }
}
</script>
