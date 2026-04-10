<template>
    <transition
        name="vn-trend-slide"
        @before-leave="notifyTransition(true)"
        @after-leave="notifyTransition(false)"
    >
        <div class="vn-trend" v-show="visible">
            <div class="vn-trend__loading" v-if="isLoading">
                <i class="el-icon-loading"></i>
            </div>
            <div class="vn-trend__layout" v-else-if="list.length > 0">
                <div class="vn-trend__tabs">
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        class="vn-trend__tab"
                        :class="{ 'is-active': activeTab === tab.key }"
                        @click="activeTab = tab.key"
                    >{{ tab.label }}</button>
                </div>

                <div class="vn-trend__content" ref="content">
                    <div class="vn-trend__num-grid" v-if="activeTab === 'sp'">
                        <div
                            v-for="(item, i) in displayList.slice(0, 20)"
                            :key="i"
                            class="vn-trend__num-cell"
                            :class="{ 'is-shade': isShade(i), 'is-waiting': i === 0 && !item.sping }"
                        >
                            <span v-if="i === 0 && !item.sping" class="vn-trend__dots">...</span>
                            <template v-else>{{ item.sping || '-' }}</template>
                        </div>
                    </div>

                    <div class="vn-trend__num-grid" v-if="activeTab === 'eight'">
                        <div
                            v-for="(item, i) in displayList.slice(0, 20)"
                            :key="i"
                            class="vn-trend__num-cell"
                            :class="{ 'is-shade': isShade(i), 'is-waiting': i === 0 && !item['8ping'] }"
                        >
                            <span v-if="i === 0 && !item['8ping']" class="vn-trend__dots">...</span>
                            <template v-else>{{ item['8ping'] || '-' }}</template>
                        </div>
                    </div>

                    <div class="vn-trend__chart" v-if="activeTab === 'bs'">
                        <div
                            v-for="(row, ri) in bsGrid"
                            :key="ri"
                            class="vn-trend__chart-row"
                        >
                            <div
                                v-for="(cell, ci) in row"
                                :key="ci"
                                class="vn-trend__chart-cell"
                                :class="[cell, { 'is-last': ci === row.length - 1 }]"
                                :content="cell || ''"
                            ></div>
                        </div>
                    </div>

                    <div class="vn-trend__chart" v-if="activeTab === 'eo'">
                        <div
                            v-for="(row, ri) in eoGrid"
                            :key="ri"
                            class="vn-trend__chart-row"
                        >
                            <div
                                v-for="(cell, ci) in row"
                                :key="ci"
                                class="vn-trend__chart-cell"
                                :class="[cell, { 'is-last': ci === row.length - 1 }]"
                                :content="cell || ''"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="vn-trend__empty">暂无数据</div>
        </div>
    </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'VnTrendPopup',
    props: {
        visible: { type: Boolean, default: false },
        lotteryId: { type: [Number, String], default: null }
    },
    data() {
        return {
            isLoading: false,
            loadedLotteryId: null,
            pendingCountdownRefresh: false,
            activeTab: 'sp',
            tabs: [
                { key: 'sp', label: 'SP' },
                { key: 'eight', label: 'eight' },
                { key: 'bs', label: 'B/S' },
                { key: 'eo', label: 'E/O' }
            ]
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.ensureLoaded(true)
            }
        },
        isLoading(val) {
            if (!val && this.pendingCountdownRefresh && this.visible && this.isCountdownClosed) {
                this.pendingCountdownRefresh = false
                this.ensureLoaded(true)
            }
        },
        lotteryId(val, oldVal) {
            if (`${val || ''}` === `${oldVal || ''}`) return
            this.reset()
            if (this.visible) {
                this.ensureLoaded(true)
            }
        },
        isCountdownClosed(val, oldVal) {
            if (!this.visible || !val || oldVal !== false) return

            if (this.isLoading) {
                this.pendingCountdownRefresh = true
                return
            }

            this.ensureLoaded(true)
        },
        activeTab(val) {
            if (val === 'bs' || val === 'eo') {
                this.$nextTick(() => this.scrollToRight())
            }
        }
    },
    computed: {
        ...mapGetters(['VN_trend', 'VN_flipTimer', 'VN_localArea']),
        list() {
            return Array.isArray(this.VN_trend) ? this.VN_trend : []
        },
        currentFlipTimer() {
            return this.VN_flipTimer[this.VN_localArea] || {}
        },
        isCountdownClosed() {
            return !!this.VN_localArea && this.currentFlipTimer.isCountDown === false
        },
        displayList() {
            if (!this.list.length) return []
            if (!this.list[0].sping && !this.list[0]['8ping']) {
                return this.list
            }

            return [{
                issue: '',
                sping: '',
                '8ping': '',
                BSxy: [],
                EOxy: []
            }, ...this.list]
        },
        bsGrid() {
            return this.buildGrid('BSxy', 'BS8', {
                '大': 'B',
                '小': 'S'
            })
        },
        eoGrid() {
            return this.buildGrid('EOxy', 'EO8', {
                '双': 'E',
                '單': 'O',
                '单': 'O'
            })
        }
    },
    methods: {
        ...mapActions([
            _M.GET_GAME_TREND_VN
        ]),
        notifyTransition(isClosing) {
            this.$emit('transitioning', isClosing)
        },
        close() {
            this.$emit('close')
        },
        reset() {
            this.loadedLotteryId = null
            this.pendingCountdownRefresh = false
        },
        async ensureLoaded(force = false) {
            const lotteryKey = `${this.lotteryId || ''}`

            if (!force && this.loadedLotteryId === lotteryKey && this.list.length) {
                if (this.activeTab === 'bs' || this.activeTab === 'eo') {
                    this.$nextTick(() => this.scrollToRight())
                }
                return
            }
            if (this.isLoading) return

            this.isLoading = true
            try {
                const nextList = await this[_M.GET_GAME_TREND_VN](+this.lotteryId)
                this.loadedLotteryId = nextList.length ? lotteryKey : null
            } finally {
                this.isLoading = false
            }

            if (this.activeTab === 'bs' || this.activeTab === 'eo') {
                this.$nextTick(() => this.scrollToRight())
            }
        },
        scrollToRight() {
            const el = this.$refs.content
            if (el) el.scrollLeft = el.scrollWidth
        },
        getTrendPoint(point = []) {
            if (!Array.isArray(point) || point.length < 2) return null

            const x = +point[0]
            const y = Math.abs(+point[1])

            if (!x || !y) return null

            return {
                col: x - 1,
                row: y - 1
            }
        },
        buildGrid(pointKey, valueKey, valueMap) {
            const ROWS = 6
            const source = this.list || []
            const points = source
                .map((item) => {
                    const point = this.getTrendPoint(item[pointKey])
                    const type = valueMap[item[valueKey]]

                    if (!point || !type || point.row >= ROWS) return null

                    return {
                        ...point,
                        type
                    }
                })
                .filter(Boolean)

            const maxCol = points.length
                ? Math.max(...points.map(point => point.col))
                : 0
            const grid = Array.from({ length: ROWS }, () => Array(maxCol + 2).fill(null))

            points.forEach(({ row, col, type }) => {
                grid[row][col] = type
            })

            return grid
        },
        isShade(i) {
            const row = i % 5
            const col = Math.floor(i / 5)
            return (row + col) % 2 === 1
        }
    }
}
</script>

<style lang="scss" scoped>
.vn-trend-slide-enter-active,
.vn-trend-slide-leave-active {
    transition: height 0.2s ease;
    overflow: hidden;
    will-change: height;
}

.vn-trend-slide-enter,
.vn-trend-slide-leave-to {
    height: 62px !important;
}

.vn-trend-slide-enter-to,
.vn-trend-slide-leave {
    height: 194px !important;
}

.vn-trend {
    width: 100%;
    height: 194px;
    background: #fff;
    font-size: 12px;
    padding-top: 62px;
    box-sizing: border-box;

    &__loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 132px;
        color: #999;
        font-size: 20px;
    }

    &__empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 132px;
        color: #999;
    }

    @keyframes vn-dots {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.2; }
    }

    &__dots {
        display: inline-block;
        color: #f57c00;
        font-weight: bold;
        letter-spacing: 2px;
        animation: vn-dots 1.2s ease-in-out infinite;
    }

    &__layout {
        display: flex;
        height: 132px;
        overflow: hidden;
    }

    &__tabs {
        flex-shrink: 0;
        width: 52px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #e8e0cc;
    }

    &__tab {
        flex: 1;
        background: #fff;
        border: none;
        border-bottom: 1px solid #e8e0cc;
        color: #555;
        font-size: 11px;
        font-weight: bold;
        cursor: pointer;
        padding: 0 4px;
        line-height: 1.2;

        &:last-child {
            border-bottom: none;
        }

        &.is-active {
            background: #f57c00;
            color: #fff;
        }
    }

    &__content {
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    &__num-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(5, 1fr);
        grid-auto-flow: column;
        height: 100%;
    }

    &__num-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #111;
        background: #fbefdf;
        border-bottom: 1px solid #f4e6d2;
        border-right: 1px solid #f4e6d2;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.is-shade {
            background: #fff;
        }

        &.is-waiting {
            background: #fbefdf;
        }
    }

    &__chart {
        background: #34373d;
        min-width: max-content;
    }

    &__chart-row {
        display: flex;
    }

    &__chart-cell {
        width: 22px;
        height: 22px;
        background: #34373d;
        border: 1px solid rgba(255, 255, 255, 0.45);
        border-right: none;
        border-top: none;
        position: relative;
        flex-shrink: 0;

        &::before {
            content: attr(content);
            position: absolute;
            border-radius: 50%;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            width: 85%;
            height: 85%;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 600;
            line-height: 1;
            color: #fff;
            box-sizing: border-box;
            pointer-events: none;
        }

        &.B::before { background-color: #ff1f14; }
        &.S::before { background-color: #ebae43; }
        &.E::before { background-color: #ff1f14; }
        &.O::before { background-color: #ebae43; }

        &.is-last {
            border-right: 1px solid rgba(255, 255, 255, 0.45);
        }
    }
}
</style>
