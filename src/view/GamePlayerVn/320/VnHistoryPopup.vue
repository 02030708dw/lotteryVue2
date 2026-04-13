<template>
    <div class="vn-popup-overlay" v-if="visible" @click.self="close">
        <div class="vn-popup">
            <div class="vn-popup__header">
                <i class="el-icon-circle-close vn-popup__close" @click="close"></i>
            </div>
            <div class="vn-popup__toolbar">
                <el-select
                    class="vn-popup__select"
                    v-model="queryMenuCode"
                    v-if="!isW88"
                    :listObject="country"
                    showLabel="title_key"
                    showValue="menuCode"
                >
                    <el-option
                        v-for="(item, index) in country"
                        v-if="isShow(item.menuCode)"
                        :key="index"
                        :label="item.title_key"
                        :value="item.menuCode"
                    />
                </el-select>
                <el-date-picker
                    class="vn-popup__date"
                    type="date"
                    format="yyyy-MM-dd"
                    v-model="queryDate"
                    :editable="false"
                    :clearable="false"
                    :picker-options="pickerOptionsOpen"
                />
                <button class="vn-popup__search" @click="search">
                    <i class="el-icon-search"></i>
                </button>
            </div>
            <div class="vn-popup__subtitle">{{ $t('bettingrc_045') }}</div>
            <div class="vn-popup__body" ref="body" @scroll="onScroll">
                <template v-if="historyList.length > 0">
                    <div
                        class="gr_list__number gr_game-info__number is_active"
                        v-for="(item, index) in historyList"
                        :key="index"
                    >
                        <div class="gr_number__header u_f--bold" style="padding: 10px;">
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
import DatePicker from '@E/packages/date-picker/index.js'
import { mapGetters, mapActions } from 'vuex'
import { formatVNBingoCode } from '@UTIL/games/VN'
import { returnState, warnMessageBox } from '@UTIL'

export default {
    name: 'VnHistoryPopup',
    components: {
        [DatePicker.name]: DatePicker
    },
    props: {
        visible: { type: Boolean, default: false },
        menuCode: { type: String, default: '' }
    },
    data() {
        return {
            isLoading: false,
            pickerOptionsOpen: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || (time && time.valueOf() < Date.now() - 86400000 * 7)
                }
            }
        }
    },
    watch: {
        visible(val) {
            if (val) this.initQuery()
        }
    },
    methods: {
        ...mapActions([
            _M.GET_HISTORYBALLVN_LIST,
            _M.CLEAR_HISTORYBALLVN_LIST,
            _M.SET_HISTORYBALLVN_DATA
        ]),
        close() {
            this.$emit('update:visible', false)
        },
        initQuery() {
            this[_M.SET_HISTORYBALLVN_DATA]({
                menuCode: this.menuCode || this.queryMenuCode,
                cancelDeadline: moment().format('YYYY-MM-DD')
            })
            this.search()
        },
        resetScroll() {
            this.$nextTick(() => {
                const el = this.$refs.body
                if (el) el.scrollTop = 0
            })
        },
        async search() {
            if (!this.queryDate) {
                this.$msg(warnMessageBox({ message: 'trend_055' }))
                return
            }
            this.isLoading = true
            this[_M.CLEAR_HISTORYBALLVN_LIST]()
            this.resetScroll()
            await this[_M.GET_HISTORYBALLVN_LIST]({
                menuCode: this.queryMenuCode,
                cancelDeadline: moment(this.queryDate).format('YYYY-MM-DD'),
                next: null
            })
            this.isLoading = false
        },
        async loadMore() {
            if (this.isLoading || !this.lastIssue) return
            if (+this.lastIssue.split('-')[1] === 1) return
            this.isLoading = true
            await this[_M.GET_HISTORYBALLVN_LIST]({
                menuCode: this.queryMenuCode,
                cancelDeadline: moment(this.queryDate).format('YYYY-MM-DD'),
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
        },
        isShow(menuCode) {
            const [key] = menuCode.split('-')
            return (((this.lotteryMenu || [])[3] || {}).list || {})[key]
        }
    },
    computed: {
        ...mapGetters([
            'getHistoryBallVNTempList',
            'VN_cityData',
            'getHistoryBallVNData',
            'lotteryListLocalVN',
            'lotteryOfficialVN',
            'lotteryMenu',
            'isW88'
        ]),
        queryDate: {
            set(cancelDeadline) {
                this[_M.SET_HISTORYBALLVN_DATA]({ cancelDeadline })
            },
            get() {
                return this.getHistoryBallVNData.cancelDeadline
            }
        },
        queryMenuCode: {
            set(menuCode) {
                this[_M.SET_HISTORYBALLVN_DATA]({ menuCode })
            },
            get() {
                return this.getHistoryBallVNData.menuCode || this.menuCode
            }
        },
        country() {
            let arr = []
            Object
                .values(this.lotteryListLocalVN)
                .forEach(({ name, lottery, title_key }) => arr.push({ menuCode: `${name}-${lottery}`, title_key: this.$t(title_key) }))
            Object
                .entries(this.lotteryOfficialVN)
                .forEach(([name, obj]) => arr.push({ menuCode: `${name}-`, title_key: `${this.$t('home_016')} - ${this.$t(obj.title_key)}` }))
            return arr
        },
        historyList() {
            const official = ['VN_S', 'VN_C', 'VN_N']
            const data = Object.values(returnState(this.getHistoryBallVNTempList))
            if (data.length === 0) return []
            let result = []
            const lotName = Object.keys(data[0])[0]
            const isOfficial = official.findIndex((checkWord) => {
                return this.queryMenuCode.includes(checkWord)
            }) > -1
            data.forEach((oneGroup) => {
                Object.entries(oneGroup[lotName]).forEach(([lottery, cardsData]) => {
                    const normalizedCards = isOfficial
                        ? cardsData.map(card => ({ ...card, lottery }))
                        : cardsData
                    result = result.concat(normalizedCards)
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

    &__toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        background: #f5f0e8;
        border-bottom: 1px solid #e8e0cc;
        flex-shrink: 0;

        ::v-deep .el-input__inner {
            height: 34px;
            line-height: 34px;
            border-color: #d5ccb7;
            color: #6d6555;
            background: rgba(255, 255, 255, 0.85);
        }

        ::v-deep .el-input__icon {
            line-height: 34px;
        }
    }

    &__select {
        flex: 1 1 0;
        min-width: 0;
    }

    &__date {
        flex: 0 0 132px;
    }

    &__search {
        width: 34px;
        height: 34px;
        border: 1px solid #d5ccb7;
        background: #fff;
        color: #b7ae98;
        border-radius: 4px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
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
