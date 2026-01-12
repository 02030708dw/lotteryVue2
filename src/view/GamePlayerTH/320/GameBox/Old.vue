<template>
    <div class="gr_container bg_primary gr_container--gamebox">
        <div class="content bg_secondary_light">
            <div class="content_inner">
                <div
                    class="list u_clearfix bg_secondary_light"
                    v-for='(item, index) in TH_gameSelectDataArr'
                    :key="index"
                >
                    <div>
                        <span :class="{text_color_strong: TH_over[item.methodId]}">[{{showMethodName(item.methodId)}}]</span>
                        <strong><span class="betting_detail" />{{item.codes}}</span></strong>
                        <span :class="{text_color_strong: TH_prizeChange[item.methodId]}">@{{item.hprize}}</span>
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
                    <div @click="handleRemove(index)">
                        <a href="javascript: void(0)" ><i class="el-icon-close" /></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';

.gr_container--gamebox {
    padding: 67px 15px 45px;
    & .header {
        line-height: 29px;
        margin-bottom: 10px;
        & button {
            width: calc(100% / 3 - 8px);
        }
    }
    & .content {
        font-size: $font_size_small;
        margin: 10px 0 15px;
        padding: 0px;
        border: 1px solid gray;
        & .content_inner {
            height: calc(100vh - 183px);
            overflow-y: scroll;
            @include multi-lang {
                height: calc(100vh - 195px);
            }
            & .list {
                padding: 10px 15px;
                position: relative;
                border-bottom: 1px solid #cccccc;
                &:last-child {
                    margin-bottom: 0px;
                }
                & ul {
                    & li {
                        line-height: 18px;
                        padding: 2px 0px;
                        &.total_text {
                            margin-top:10px;
                        }
                        & table {
                            width: 100%;
                            & thead, & tbody {
                                display: block;
                                width: 50%;
                                float:left;
                            }
                            & thead {
                                background-color: #eae7da;
                            }
                            & tr {
                                width: 100%;
                                float: left;
                                & th, & td {
                                    padding: 0px 5px;
                                    height: 30px;
                                    line-height: 30px;
                                    width: 100%;
                                    float: left;
                                    text-align: center;
                                    vertical-align: middle;
                                    border-right: 1px solid border_color(dark);
                                    border-bottom: 1px solid border_color(dark);
                                    &:first-child {
                                        border-top: 1px solid border_color(dark);
                                    }
                                }
                                & th {
                                    border-left: 1px solid border_color(dark);
                                }
                            }
                        }
                    }
                }
                & > div {
                    line-height: 22px;
                    & a i {
                        color: #b3b3b3;
                        height: 100%;
                        line-height: 55px;
                        text-align: center;
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 55px;
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
        }
    }
}
</style>
<script>
import { formatNumber } from '@UTIL'
import { mapGetters, mapActions } from 'vuex'
import BoxMixin from '@V/GamePlayerTH/components/BoxMixin'

export default {
    name: 'GameBoxOld',
    mixins: [BoxMixin],
    data() {
        return {
        }
    },
    updated() {
        this.TH_gameSelectDataArr.length < 1 && this.$root.$emit('back')
    },
    computed: {
        ...mapGetters([
            'isShowDemo',
            'TH_gameSelectData',
            'TH_gameSelectDataArr',
            'TH_flipTimer',
            'TH_gameSubMenuObj',
            'TH_menuIndex',
            'TH_ltMoneyAmout',
            'TH_codeTime',
            'TH_over',
            'TH_stake',
            'TH_prizeChange'
        ]),
        balance() {
            return formatNumber(this.availableBalance) || '0'
        }
    },
    methods: {
        ...mapActions([
            _M.SET_TH_TEMP_DATA,
            _M.GAME_ORDER_TH_SUBMIT
        ])
    }
}
</script>
