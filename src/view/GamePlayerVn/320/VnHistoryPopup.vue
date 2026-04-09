<template>
    <div class="vn-popup-overlay" v-if="visible" @click.self="close">
        <div class="vn-popup">
            <div class="vn-popup__header">
                <i class="el-icon-circle-close vn-popup__close" @click="close"></i>
            </div>
            <div class="vn-popup__subtitle">{{ $t('bettingrc_045') }}</div>
            <div class="vn-popup__body" ref="body" @scroll="onScroll">
                <template v-if="historyList.length > 0">
                    <div
                        class="gr_list__number gr_game-info__number is_active"
                        v-for="(item, index) in historyList"
                        :key="index"
                    >
                        <div class="gr_number__header u_f--bold">
                            {{ VN_cityData[item.lottery] ? $t(VN_cityData[item.lottery]) : $t('common_001', { 0: item.issue }) }}
                        </div>
                        <div class="gr_number__content">
                            <dl class="gr_number__content--item" v-for="(number, ranking) in formatPrize(item.code)" :key="ranking">
                                <dt class="gr_number__item--title">
                                    <i class="gr_item__title--icon">{{ formatPrize(item.code).length - (ranking + 1) }}</i>
                                </dt>
                                <dd class="gr_number__item--content">
                                    <span class="gr_item__content--item" :data-number="no + 1" v-for="(i, no) in number" :key="no">{{ i || '-' }}</span>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </template>
                <div v-else-if="!isLoading" class="vn-popup__empty">{{ $t('trend_054') }}</div>
                <div v-if="isLoading" class="vn-popup__loading">
                    <i class="el-icon-loading"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatVNBingoCode } from '@UTIL/games/VN'
import { returnState } from '@UTIL'

export default {
    name: 'VnHistoryPopup',
    props: {
        visible: { type: Boolean, default: false },
        menuCode: { type: String, default: '' }
    },
    data() {
        return {
            isLoading: false
        }
    },
    watch: {
        visible(val) {
            if (val) this.load()
        }
    },
    methods: {
        ...mapActions([
            _M.GET_HISTORYBALLVN_LIST,
            _M.CLEAR_HISTORYBALLVN_LIST
        ]),
        close() {
            this.$emit('update:visible', false)
        },
        async load() {
            this.isLoading = true
            const today = moment().format('YYYY-MM-DD')
            this[_M.CLEAR_HISTORYBALLVN_LIST]()
            await this[_M.GET_HISTORYBALLVN_LIST]({
                menuCode: this.menuCode,
                cancelDeadline: today,
                next: null
            })
            this.isLoading = false
        },
        async loadMore() {
            if (this.isLoading || !this.lastIssue) return
            // 当天第一期为1，不再加载
            if (+this.lastIssue.split('-')[1] === 1) return
            this.isLoading = true
            await this[_M.GET_HISTORYBALLVN_LIST]({
                menuCode: this.menuCode,
                next: this.lastIssue
            })
            this.isLoading = false
        },
        onScroll() {
            const el = this.$refs.body
            if (!el) return
            if (el.scrollTop + el.offsetHeight >= el.scrollHeight - 20) {
                this.loadMore()
            }
        },
        formatPrize(prize) {
            return formatVNBingoCode(prize)
        }
    },
    computed: {
        ...mapGetters([
            'getHistoryBallVNTempList',
            'VN_cityData'
        ]),
        historyList() {
            const data = Object.values(returnState(this.getHistoryBallVNTempList))
            if (data.length === 0) return []
            let result = []
            const lotName = Object.keys(data[0])[0]
            data.forEach((oneGroup) => {
                Object.entries(oneGroup[lotName]).forEach(([lottery, cardsData]) => {
                    result = result.concat(cardsData)
                })
            })
            return result
        },
        lastIssue() {
            const list = this.historyList
            return list.length ? list[list.length - 1].issue : null
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

        // 底部金色条纹
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

        // 覆盖全局固定宽度，适配弹窗
        ::v-deep .gr_game-info__number {
            width: 90%;
            margin: 5px auto;
        }
        ::v-deep .gr_game-info__number + .gr_game-info__number {
            margin-top: 8px;
        }
    }

    &__loading {
        text-align: center;
        padding: 16px 0;
        color: #999;
        font-size: 14px;
    }

    &__empty {
        text-align: center;
        padding: 40px 0;
        color: #999;
        font-size: 14px;
    }
}
</style>
