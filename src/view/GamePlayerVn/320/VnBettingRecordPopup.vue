<template>
    <div class="vn-popup-overlay" v-if="visible" @click.self="close">
        <div class="vn-popup">
            <div class="vn-popup__header">
                <i
                    v-if="GameInfoDetailIndex !== -1"
                    class="el-icon-arrow-left vn-popup__back"
                    @click="goBackToList"
                ></i>
                <i class="el-icon-circle-close vn-popup__close" @click="close"></i>
            </div>

            <template v-if="GameInfoDetailIndex === -1">
                <div class="vn-popup__subtitle">{{ $t('bettingrc_045') }}</div>
                <div class="vn-popup__body gr_page__content" ref="body" @scroll="onScroll">
                    <div class="table_default table_stripe table_hover_bg">
                        <table>
                            <tbody v-if="tempList.length > 0">
                                <tr v-for="(item, index) in tempList" :key="index">
                                    <td @click="showDetail(index)">
                                        <div class="u_p--t10">
                                            <span>{{ $t(item.i18n_lottery_name_key) }}</span>
                                            <span>[{{ $t(methodName(item)) }}]</span>
                                        </div>
                                        <div class="u_p--b10">
                                            <span>{{ $t('popup_032') }}: {{ item.issue }}</span>
                                            <span class="u_f--right" :class="statusCls(item)">
                                                {{ $t(prizeStateText(item)) }}
                                            </span>
                                        </div>
                                        <i class="el-icon-arrow-right" />
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot v-else-if="!gameInfoIsLoading">
                                <tr><td class="vn-popup__empty">{{ $t('bettingrc_031') }}</td></tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="vn-popup__loading" v-if="gameInfoIsLoading">
                        <i class="el-icon-loading"></i>
                    </div>
                </div>
                <div class="vn-popup__footer" v-if="gameSum && gameSum.sum_total_price > 0">
                    <span>{{ $t('bettingrc_073') }} {{ formatNumber(gameSum.sum_total_price) }}</span>
                    <span>{{ $t('bettingrc_015') }} {{ formatNumber(gameSum.sum_bonus) }}</span>
                </div>
            </template>

            <div class="vn-popup__body vn-popup__body--detail" v-else ref="detailBody">
                <VnBettingDetail />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { today, formatNumber } from '@UTIL'
import { betStatusCls, methodName, traceSubTaskStatus } from '@UTIL/presenter'
import VnBettingDetail from './VnBettingDetail'

export default {
    name: 'VnBettingRecordPopup',
    components: { VnBettingDetail },
    props: {
        visible: { type: Boolean, default: false },
        lotteryId: { type: [Number, String], default: null }
    },
    watch: {
        visible(val) {
            if (val) {
                this.load()
            } else {
                this[_M.SET_GAME_INFO_DETAIL_INDEX](-1)
            }
        },
        GameInfoDetailIndex(val) {
            if (val !== -1) {
                this.$nextTick(() => {
                    this.resetDetailScroll()
                })
            }
        }
    },
    methods: {
        ...mapActions([
            _M.GET_GAME_INFO_LIST,
            _M.SET_GAME_INFO_DATA,
            _M.CLEAR_GAME_INFO_DATA,
            _M.SET_GAME_INFO_DETAIL_INDEX
        ]),
        close() {
            this[_M.SET_GAME_INFO_DETAIL_INDEX](-1)
            this.$emit('update:visible', false)
        },
        async load() {
            this[_M.CLEAR_GAME_INFO_DATA]()
            this[_M.SET_GAME_INFO_DATA]({
                startDate: today(),
                endDate: today(),
                lotteryId: this.lotteryId || null,
                periodType: 1,
                status: [0, 1, 2, 3],
                functionType: 'all'
            })
            await this[_M.GET_GAME_INFO_LIST]({
                calSum: true,
                functionType: 'all',
                countryType: 'vn'
            })
        },
        async loadMore() {
            if (this.gameInfoIsLoading) return
            if (this.currentPage >= this.totalPage) return
            await this[_M.GET_GAME_INFO_LIST]({
                page: this.currentPage + 1,
                calSum: false,
                functionType: 'all',
                countryType: 'vn'
            })
        },
        onScroll() {
            const el = this.$refs.body
            if (!el || this.gameInfoIsLoading) return
            if (el.scrollTop + el.offsetHeight >= el.scrollHeight - 50) {
                this.loadMore()
            }
        },
        resetDetailScroll() {
            const el = this.$refs.detailBody
            if (el) {
                el.scrollTop = 0
            }
        },
        showDetail(index) {
            this[_M.SET_GAME_INFO_DETAIL_INDEX](index)
        },
        goBackToList() {
            this[_M.SET_GAME_INFO_DETAIL_INDEX](-1)
        },
        statusCls(item) {
            return betStatusCls(item)
        },
        methodName(method) {
            return methodName(method)
        },
        prizeStateText(item) {
            return traceSubTaskStatus(item).txt || 'bettingrc_018'
        },
        formatNumber(number) {
            return formatNumber(number)
        }
    },
    computed: {
        ...mapGetters([
            'gameInfoIsLoading',
            'gameInfoList',
            'gameTempInfo',
            'gameSum',
            'GameInfoDetailIndex'
        ]),
        currentPage() {
            return (this.gameInfoList && this.gameInfoList.pagination)
                ? this.gameInfoList.pagination.page
                : 0
        },
        totalPage() {
            return (this.gameInfoList && this.gameInfoList.pagination)
                ? this.gameInfoList.pagination.totalPage
                : 0
        },
        tempList() {
            const cp = this.currentPage
            let arr = []
            for (let i = 1; i <= cp; i++) {
                if (this.gameTempInfo[i] && this.gameTempInfo[i].data) {
                    arr = [...arr, ...(this.gameTempInfo[i].data.list || [])]
                }
            }
            return arr
        }
    }
}
</script>

<style lang="scss" scoped>
.vn-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
}

.vn-popup {
    width: 90%;
    height: 80vh;
    background: #fff;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-size: 14px;

    &__header {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        position: relative;
        padding: 0 10px;
        height: 35px;
        box-shadow: 0 -22px 0 #333333 inset, 0 -44px 0 #484848 inset;
        color: #fff;
        flex-shrink: 0;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(to right, #be965d 0, #976f40 28%, #ffcb85 63%, #976f40 100%);
        }
    }

    &__back {
        position: absolute;
        left: 10px;
        font-size: 20px;
        color: #ffcb85;
        cursor: pointer;
    }

    &__close {
        font-size: 22px;
        color: #ffcb85;
        cursor: pointer;
    }

    &__subtitle {
        padding: 8px 12px;
        font-size: 12px;
        color: #666;
        background: #f5f0e8;
        border-bottom: 1px solid #e8e0cc;
        flex-shrink: 0;
    }

    &__body {
        overflow-y: auto;
        flex: 1;
        background: #fff;
        min-height: 0 !important;
        padding: 0 !important;

        ::v-deep .table_default table {
            border: none;
            width: 100%;

            tbody td {
                border: none;
                position: relative;
                text-align: left;
                padding: 0 35px 0 10px;
            }

            tfoot td {
                text-align: center;
                padding: 40px 0;
                color: #999;
            }

            i.el-icon-arrow-right {
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
                color: #b3b3b3;
            }
        }

        ::v-deep .table_hover_bg tbody td:hover {
            cursor: pointer;
        }

        &--detail {
            padding: 0 !important;
            overflow-y: auto;
        }
    }

    &__footer {
        flex-shrink: 0;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        text-align: right;
        padding: 8px 0;
        font-size: 13px;

        span {
            margin-right: 16px;
        }
    }

    &__loading {
        text-align: center;
        padding: 16px 0;
        color: #999;
    }

    &__empty {
        text-align: center;
        padding: 40px 0;
        color: #999;
    }
}
</style>
