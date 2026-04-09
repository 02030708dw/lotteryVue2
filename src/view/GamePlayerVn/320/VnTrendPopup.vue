<template>
    <transition name="vn-trend-slide">
        <div class="vn-trend" v-if="visible">
            <div class="vn-trend__loading" v-if="isLoading">
                <i class="el-icon-loading"></i>
            </div>
            <div class="vn-trend__layout" v-else-if="list.length > 0">
                <!-- 左侧 Tab 按钮 -->
                <div class="vn-trend__tabs">
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        class="vn-trend__tab"
                        :class="{ 'is-active': activeTab === tab.key }"
                        @click="activeTab = tab.key"
                    >{{ tab.label }}</button>
                </div>

                <!-- 右侧内容区 -->
                <div class="vn-trend__content" ref="content">

                    <!-- SP: sping 号码，只展示5行×4列=20奖期 -->
                    <div class="vn-trend__num-grid" v-if="activeTab === 'sp'">
                        <div
                            v-for="(item, i) in list.slice(0, 20)"
                            :key="i"
                            class="vn-trend__num-cell"
                            :class="{ 'is-shade': isShade(i), 'is-waiting': i === 0 && !item.sping }"
                        >
                            <span v-if="i === 0 && !item.sping" class="vn-trend__dots">...</span>
                            <template v-else>{{ item.sping || '-' }}</template>
                        </div>
                    </div>

                    <!-- eight: 八平码，只展示5行×4列=20奖期 -->
                    <div class="vn-trend__num-grid" v-if="activeTab === 'eight'">
                        <div
                            v-for="(item, i) in list.slice(0, 20)"
                            :key="i"
                            class="vn-trend__num-cell"
                            :class="{ 'is-shade': isShade(i), 'is-waiting': i === 0 && !item['8ping'] }"
                        >
                            <span v-if="i === 0 && !item['8ping']" class="vn-trend__dots">...</span>
                            <template v-else>{{ item['8ping'] || '-' }}</template>
                        </div>
                    </div>

                    <!-- B/S: 大小走势瀑布图 -->
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

                    <!-- E/O: 单双走势瀑布图 -->
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
import { handleAjax } from '@UTIL'
import { API } from '@API'

const BSEO_PAIRS = [
    { bs: 1, eo: 1 }, { bs: 1, eo: -1 }, { bs: -1, eo: 1 }, { bs: -1, eo: -1 },
    { bs: 1, eo: 1 }, { bs: -1, eo: -1 }, { bs: 1, eo: -1 }, { bs: -1, eo: 1 }
]

function genMock() {
    const items = []
    // 第 0 条：当前期，尚未开奖
    items.push({ issue: '20260409-2100', '8ping': '', sping: '', BS8: '', E08: '', BSxy: [], EOxy: [] })

    // 生成 49 期历史数据
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    const pad = (n, l) => String(n).padStart(l, '0')

    // 用于生成连续方向的 streak 生成器
    function genStreaks(isBig, streakLen) {
        // streakLen: 1-4 的随机连续数
        const arr = []
        let remaining = streakLen
        let cur = isBig ? 1 : -1
        while (remaining > 0) {
            const take = Math.min(remaining, rand(1, Math.min(4, remaining)))
            arr.push(cur * take)
            cur = -cur
            remaining -= take
        }
        return arr
    }

    for (let i = 0; i < 49; i++) {
        const issueNum = 2099 - i
        const sp = pad(rand(0, 999999), 6)
        const ep = pad(rand(0, 99), 2)
        const isBig = parseInt(ep) >= 50
        const isOdd = parseInt(ep) % 2 === 1
        items.push({
            issue: `20260409-${issueNum}`,
            '8ping': ep,
            sping: sp,
            BS8: isBig ? '大' : '小',
            E08: isOdd ? '单' : '双',
            BSxy: genStreaks(isBig, rand(2, 4)),
            EOxy: genStreaks(isOdd, rand(2, 4))
        })
    }
    return items
}

export default {
    name: 'VnTrendPopup',
    props: {
        visible: { type: Boolean, default: false },
        lotteryId: { type: [Number, String], default: null }
    },
    data() {
        return {
            isLoading: false,
            list: [],
            activeTab: 'sp',
            tabs: [
                { key: 'sp',    label: 'SP' },
                { key: 'eight', label: 'eight' },
                { key: 'bs',    label: 'B/S' },
                { key: 'eo',    label: 'E/O' }
            ]
        }
    },
    watch: {
        visible(val) {
            if (val) this.load()
            else this.reset()
        },
        activeTab(val) {
            if (val === 'bs' || val === 'eo') {
                this.$nextTick(() => this.scrollToRight())
            }
        }
    },
    computed: {
        bsGrid() {
            return this.buildGrid('BSxy', 'B', 'S')
        },
        eoGrid() {
            return this.buildGrid('EOxy', 'E', 'O')
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        reset() {
            this.list = []
            this.activeTab = 'sp'
        },
        async load() {
            this.isLoading = true
            this.reset()
            // TODO: 替换为真实 API（接口 500 修复后）
            // const res = await handleAjax(API.getVndTrend, { lotteryId: +this.lotteryId }, this.$store.getters, { isNotShowMessageBox: true })
            // if (res && res.data) this.list = Array.isArray(res.data) ? res.data : []

            await new Promise(r => setTimeout(r, 300))
            this.list = genMock()
            this.isLoading = false
        },
        scrollToRight() {
            const el = this.$refs.content
            if (el) el.scrollLeft = el.scrollWidth
        },
        buildGrid(key, posLabel, negLabel) {
            const MIN_ROWS = 6
            const cols = []
            // 跳过第 0 条（当前期尚未开奖）
            this.list.slice(1).forEach(item => {
                (item[key] || []).forEach(val => {
                    if (val === 0) return
                    cols.push({ type: val > 0 ? posLabel : negLabel, depth: Math.abs(val) })
                })
            })

            // 末尾加一列空列（待开奖占位）
            const totalCols = cols.length + 1
            const maxDepth = cols.length
                ? Math.max(MIN_ROWS, ...cols.map(c => c.depth))
                : MIN_ROWS

            const grid = Array.from({ length: maxDepth }, () => Array(totalCols).fill(null))
            cols.forEach((col, ci) => {
                for (let r = 0; r < col.depth; r++) {
                    grid[r][ci] = col.type
                }
            })
            // 最后一列保持 null（空列）
            return grid
        },
        isShade(i) {
            const col = i % 4
            const row = Math.floor(i / 4)
            return (row + col) % 2 === 1
        }
    }
}
</script>

<style lang="scss" scoped>
// 固定高度过渡，避免 max-height 每帧重新计算布局导致卡顿
// 总高度 = padding-top(62px) + layout(132px) = 194px
.vn-trend-slide-enter-active,
.vn-trend-slide-leave-active {
    transition: height 0.2s ease;
    overflow: hidden;
}
.vn-trend-slide-enter,
.vn-trend-slide-leave-to {
    height: 0 !important;
}
.vn-trend-slide-enter-to,
.vn-trend-slide-leave {
    height: 194px !important;
}


.vn-trend {
    width: 100%;
    background: #fff;
    font-size: 12px;
    padding-top: 62px;
    box-sizing: border-box;  // 让 height 包含 padding，过渡时精确控制总高度

    &__loading {
        text-align: center;
        padding: 28px 0;
        color: #999;
        font-size: 20px;
    }

    &__empty {
        text-align: center;
        padding: 28px 0;
        color: #999;
    }

    // 等待开奖的 ... 动画
    @keyframes vn-dots {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.2; }
    }
    &__dots {
        display: inline-block;
        color: #f57c00;
        font-weight: bold;
        letter-spacing: 2px;
        animation: vn-dots 1.2s ease-in-out infinite;
    }

    // 左右布局：固定 132px（= 6行 × 22px，与 B/S E/O 图高度一致）
    &__layout {
        display: flex;
        height: 132px;
        overflow: hidden;
    }

    // 左侧 Tab 列
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

    // 右侧内容区（可横向滚动，隐藏滚动条）
    &__content {
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none; // Firefox
        &::-webkit-scrollbar { display: none; } // Chrome/Safari
    }

    // ── 数字格（SP / eight）────────────────────────
    &__num-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(5, 1fr);
        height: 100%;
    }

    &__num-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #333;
        background: #fff;
        border-bottom: 1px solid #f5f0e8;
        border-right: 1px solid #f5f0e8;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.is-shade {
            background: #fff0e0;
        }

        &.is-waiting {
            background: #fff8f0;
        }
    }

    // ── 走势瀑布图（B/S, E/O）──────────────────────
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
        border: 1px solid white;
        border-right: none;
        border-top: none;
        position: relative;
        flex-shrink: 0;

        // 用 ::before 渲染圆圈，与参考实现一致
        &::before {
            content: attr(content);
            position: absolute;
            border-radius: 50%;
            inset: 0;
            margin: auto;
            width: 85%;
            height: 85%;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: #fff;
        }

        &.B::before { background-color: #e05252; }
        &.S::before { background-color: #ebae43; }
        &.E::before { background-color: #e05252; }
        &.O::before { background-color: #ebae43; }

        // 最右侧空列（待开奖占位）
        &.is-last {
            border-right: 1px solid white;
        }
    }
}
</style>
