<template>
    <div class="gr_container bg_primary">
        <div class="header">
            <button class="c_button--default" @click="handleEmpty">
                <i class="c_button__icon  i_clear" />
                <span class="c_button__text">
                    <!-- {{$t("清空")}} -->
                    {{$t('common_049')}}
                </span>
            </button>
            <button class="c_button--default" @click="randomLotterys(1)" v-if="!isBlocked">
                <i class="c_button__icon  i_ramdon" />
                <span class="c_button__text">
                    <!-- {{$t("机选1注")}} -->
                    {{$t('common_070')}}
                </span>
            </button>
            <button class="c_button--default" @click="randomLotterys(5)" v-if="!isBlocked">
                <i class="c_button__icon  i_ramdon" />
                <span class="c_button__text">
                    <!-- {{$t("机选5注")}} -->
                    {{$t('common_071')}}
                </span>
            </button>
        </div>
        <div class="content bg_secondary_light">
            <div class="content_inner">
                <div class="list u_clearfix" v-for='(items, index) in ltProject' :key="index" >
                    <div>
                        <span>#{{items.issue}}</span>
                    </div>
                    <div>
                        <span :class="(items.isOver) ? 'text_color_strong': ''">
                            [{{showMethodName(items.parentName, items.childNameKey)}}]
                        </span>
                        <span class="betting_detail"><strong v-html="items.showCodes" class="betting_detail" /></strong></span>
                        <span>@{{items.hprize}}</span>
                        <a href="javascript: void(0)" @click.stop.prevent="handleRemove(index)" ><i class="el-icon-close" /></a>
                    </div>
                    <div class="c_input--medium">
                        <input
                            type="text"
                            class="c_input__inner  u_t--center"
                            v-model="moneyTempArr[index]"
                            @blur="handleBlur($event, index)"
                            v-clean-input:int.long="{val: moneyTempArr[index], setVal: setMoneyTemp(index), cb: afterCleanInput(index)}"
                        >
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
                        .list_detail_title {
                        	white-space: nowrap;
                        }
                        & div {
                            padding: 0 35px 0 10px;
                            position: relative;
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
/deep/ .betting_detail span {
    margin: 0 2px;
    &.sy {
        margin: 0 5px;
    }
}
</style>
<script>
import GameBox from '../980/GameBox'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'GameBox320',
    mixins: [GameBox],
    methods: {
        ...mapActions([
            _M.SET_GAME_SHOW_MODE,
            _M.SET_HEADER_NAV_IS_BACK
        ])
    },
    watch: {
        gameShowMode(nVal) {
            //開啟投注項時刷新注單狀態
            nVal === 2 && this.$forceUpdate()
        }
    },
    computed: {
        ...mapGetters([
            'keepPoint',
            'gameShowMode',
            'floatPrize',
            'gameOrder'
        ])
    }
}
</script>
