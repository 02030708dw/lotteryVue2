<template>
    <div class="vn-history-mobile">
        <div class="vn-history-mobile__panel" ref="panel">
            <div class="vn-history-mobile__content">
                <!-- 表头：5列期号 -->
                <div class="vn-history-mobile__head">
                    <div class="vn-history-mobile__headLevel">奖期</div>
                    <div class="vn-history-mobile__headCol" v-for="(col, idx) in cols" :key="idx">
                        {{ formatIssue(col.issue) }}
                    </div>
                </div>

                <!-- 表体：9行(0~8)，每行5列 -->
                <div class="vn-history-mobile__list">
                    <dl class="vn-history-mobile__item" v-for="(level, rowIndex) in levels" :key="level">
                        <dt class="vn-history-mobile__level">
                            <i class="vn-history-mobile__badge">
                                {{ level }}
                            </i>
                        </dt>

                        <dd class="vn-history-mobile__nums">
                            <div class="vn-history-mobile__grid">
                                <div class="vn-history-mobile__col" v-for="(col, cIdx) in cols" :key="cIdx">
                                    <div class="vn-history-mobile__num"
                                        v-for="(v, i) in normalizeCell(col.rows[rowIndex])" :key="i">
                                        {{ v || '-' }}
                                    </div>
                                </div>
                            </div>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatVNBingoCode } from '@UTIL/games/VN'

export default {
    name: 'GamesHistoryMobile',
    props: {
        handleHistoryToggle: {
            type: Function,
            required: true
        }
    },
    computed: {
        ...mapGetters(['VN_lastNumber_V2']),

        // 取最新 5 期，每期把 code 格式化成 9 行，并 reverse 成：8 在上，0 在下
        cols() {
            const src = Array.isArray(this.VN_lastNumber_V2) ? this.VN_lastNumber_V2 : []
            const raw = src.slice(0, 5).map(it => {
                const rows = formatVNBingoCode((it && it.code) || '')
                return {
                    issue: it && it.issue,
                    rows: Array.isArray(rows) ? rows.slice().reverse() : []
                }
            })

            // 不足 5 列补空列（防止布局乱）
            const rowCount = raw[0].rows.length || 9
            while (raw.length < 5) {
                raw.push({ issue: '', rows: Array.from({ length: rowCount }, () => '-') })
            }
            return raw
        },

        // 行数（一般 9）
        rowCount() {
            return this.cols[0].rows.length || 0
        },

        // 左侧等级：8 ~ 0
        levels() {
            const n = this.rowCount
            return Array.from({ length: n }, (_, i) => (n - 1) - i)
        }
    },
    mounted() {
        document.addEventListener('mousedown', this.onGlobalDown, true)
        document.addEventListener('touchstart', this.onGlobalDown, true)
    },
    beforeDestroy() {
        document.removeEventListener('mousedown', this.onGlobalDown, true)
        document.removeEventListener('touchstart', this.onGlobalDown, true)
    },
    methods: {
        onGlobalDown(e) {
            const panel = this.$refs.panel
            if (!panel) return
            if (panel.contains(e.target)) return
            this.handleHistoryToggle()
        },

        // 20260119-1920 => 1920（你要完整就直接 return issue）
        formatIssue(issue) {
            if (!issue) return ''
            const parts = String(issue).split('-')
            return parts[1] || issue
        },

        // 单元格统一成数组（多条就换行显示）
        normalizeCell(cell) {
            if (Array.isArray(cell)) {
                const list = cell
                    .flat()
                    .map(v => (v == null ? '' : String(v)).trim())
                    .filter(Boolean)
                return list.length ? list : ['-']
            }
            if (typeof cell === 'string') {
                const s = cell.trim()
                if (!s) return ['-']
                const arr = s.split(',').map(x => x.trim()).filter(Boolean)
                return arr.length ? arr : [s]
            }
            return ['-']
        }
    }
}
</script>

<style scoped lang="scss">
.vn-history-mobile {
    position: fixed;
    z-index: 9999;

    top: 105px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 12px;
    width: calc(100% - 24px);
    max-width: 360px;
    /* 原来 300 太窄，5列会挤；这里放宽 */

    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.14);

    /* 顶部三角（在外层，不会被 panel 的 overflow 裁掉） */
    &::before {
        content: '';
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
        border-bottom: 9px solid #fff;
    }
}

/* 弹窗主体 */
.vn-history-mobile__panel {
    position: relative;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
}

.vn-history-mobile__content {
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
}

/* ===== 头部：期号 5 列 ===== */
.vn-history-mobile__head {
    display: grid;
    grid-template-columns: 40px repeat(5, 1fr);
    position: sticky;
    top: 0;
    z-index: 2;
    background: #f7f7f7;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.vn-history-mobile__headLevel {
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: #333;

    /* 对齐竖线 */
    position: relative;

    &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 6px;
        bottom: 6px;
        width: 1px;
        background: rgba(0, 0, 0, 0.12);
    }
}

.vn-history-mobile__headCol {
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: #333;
    border-left: 1px solid rgba(0, 0, 0, 0.06);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.vn-history-mobile__list {
    min-width: 0;
}

/* 行样式 + 隔行条纹 */
.vn-history-mobile__item {
    display: flex;
    align-items: stretch;

    padding: 2px 5px;
    border-bottom: 1px solid rgba(210, 170, 90, 0.45);

    &:nth-child(odd) {
        background: #fff;
    }

    &:nth-child(even) {
        background: rgba(0, 0, 0, 0.06);
    }

    &:last-child {
        border-bottom: 0;
    }
}

.vn-history-mobile__level {
    width: 40px;
    flex: 0 0 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 8px;
        bottom: 8px;
        width: 1px;
        background: rgba(0, 0, 0, 0.12);
    }
}

/* dd：放 5 列 grid */
.vn-history-mobile__nums {
    flex: 1;
    padding: 0;
    margin: 0;
}

/* 5 列格子 */
.vn-history-mobile__grid {
    display: grid;
    height: 100%;
    grid-template-columns: repeat(5, 1fr);
}

.vn-history-mobile__col {
    padding: 3px 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 1px;
}

/* ✅ 数字在格子内不换行，太长就省略 */
.vn-history-mobile__num {
    text-align: center;
    font-size: 10px;
    /* 关键：压缩字号 */
    line-height: 1.05;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

/* ✅ 行左右 padding 再压一点 */
.vn-history-mobile__item {
    padding: 2px 3px;
}


.vn-history-mobile__item {
    .vn-history-mobile__badge {
        width: 20px;
        height: 20px;
        display: block;

        color: #fff;
        text-indent: 0;
        text-align: center;
        line-height: 20px;

        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOC41MDQ0OCIgaGVpZ2h0PSIxOC44MDk1NiIgdmlld0JveD0iMCAwIDE4LjUwNDQ4IDE4LjgwOTU2Ij48dGl0bGU+6LOH55SiIDE8L3RpdGxlPjxnIGlkPSLlnJblsaRfMiIgZGF0YS1uYW1lPSLlnJblsaQgMiI+PGcgaWQ9IuWcluWxpF8xLTIiIGRhdGEtbmFtZT0i5ZyW5bGkIDEiPjxwYXRoIGQ9Ik05LjI1MjQ1LDMuMTg1NjlBNi4yMTg2OCw2LjIxODY4LDAsMSwxLDMuMDQzMzYsOS40MTQzNyw2LjIxNjUyLDYuMjE2NTIsMCwwLDEsOS4yNTI0NSwzLjE4NTY5Wk05LjI1MjQ1LDBsMS4zMzg5NCwyLjA2OTgxTDEyLjQ3NzI3LjU2ODUzbC41Mjg2LDIuMzkzNjQsMi4yOTI5Mi0uNzUwNDFMMTQuOTkzNyw0LjYyNjJsMi4zOTUzMS4wODExOUwxNi4yNzE5Miw2Ljg3ODc3bDIuMjMyNTYuODkyMzZMMTYuNzE5MzMsOS40MzQ3NWwxLjc4NTE1LDEuNjAyODUtMi4yNTIxNS45NTQzNCwxLjEzNjY4LDIuMTA5NC0yLjQzNTcuMTIyMzcuMzQ1NDgsMi4zNzQxLTIuMzMzMy0uNzEwMDdMMTIuNDc3MjcsMTguMjQxbC0xLjk0NzA2LTEuNDgxMjdMOS4yNTI0NSwxOC44MDk1Niw3LjkzMjYzLDE2LjczOTcyLDYuMDQ2MzQsMTguMjQxbC0uNTQ4MTUtMi4zOTM2NC0yLjI3MzM2Ljc1MDQ1LjMwNTA4LTIuNDE0OS0yLjQxNDQ0LS4wODE1NkwyLjIzMDk0LDExLjkzMDgsMCwxMS4wMzc2LDEuODA0NjksOS4zNzQsMCw3Ljc3MTEzbDIuMjUyMTEtLjk1MzU1TDEuMTE1NDcsNC43MDczOSwzLjU3MDMsNC41ODU4MiwzLjIyNDgyLDIuMjExNzZsMi4zMzM3MS43MTAwNy40ODc4LTIuMzUzM0w3Ljk5NDI0LDIuMDQ5Wm0wLDIuNTc2NzhhNi44Mjc2LDYuODI3NiwwLDEsMS02LjgzOCw2LjgzNzU5LDYuODI4NDYsNi44Mjg0NiwwLDAsMSw2LjgzOC02LjgzNzU5WiIgc3R5bGU9ImZpbGw6I2M2OWM2ZDtmaWxsLXJ1bGU6ZXZlbm9kZCIvPjwvZz48L2c+PC9zdmc+');
    }

    &:last-child {
        .vn-history-mobile__badge {
            width: 24px;
            height: 24px;
            color: transparent;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTguNTA0NDgiIGhlaWdodD0iMjQuOTE2NjciIHZpZXdCb3g9IjAgMCAxOC41MDQ0OCAyNC45MTY2NyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIHgxPSIxNi4zNzc5MiIgeTE9IjE3LjA0NTk0IiB4Mj0iNC4zNjA2NCIgeTI9IjEwLjEwNzc2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNzMxOGMxIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmYwMDhlIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHRpdGxlPuizh+eUoiAzPC90aXRsZT48ZyBpZD0i5ZyW5bGkXzIiIGRhdGEtbmFtZT0i5ZyW5bGkIDIiPjxnIGlkPSLlnJblsaRfMS0yIiBkYXRhLW5hbWU9IuWcluWxpCAxIj48cGF0aCBkPSJNMTMuMzMwMDksMTcuMTY1MTJsMS44MDYzNiw2Ljc5NzU4LTIuNTk4LTIuMjExNzYtLjk5MzUyLDMuMTY1NzMtMS42MjM2NC02LjAyNi43NzA4Mi0xLjIzODI1LDIuMTkyMTgsMS42NjM2MVpNOS4yNTI0NSwzLjE4NTY5QTYuMjE4NjgsNi4yMTg2OCwwLDEsMSwzLjA0MzM2LDkuNDE0MzcsNi4yMTY1Miw2LjIxNjUyLDAsMCwxLDkuMjUyNDUsMy4xODU2OVpNOS4yNTI0NSwwbDEuMzM4OTQsMi4wNjk4MUwxMi40NzcyNy41Njg1M2wuNTI4NiwyLjM5MzY0LDIuMjkyOTItLjc1MDQxTDE0Ljk5MzcsNC42MjYybDIuMzk1MzEuMDgxMTlMMTYuMjcxOTIsNi44Nzg3N2wyLjIzMjU2Ljg5MjM2TDE2LjcxOTMzLDkuNDM0NzVsMS43ODUxNSwxLjYwMjg1LTIuMjUyMTUuOTU0MzQsMS4xMzY2OCwyLjEwOTQtMi40MzU3LjEyMjM3LjM0NTQ4LDIuMzc0MS0yLjMzMzMtLjcxMDA3TDEyLjQ3NzI3LDE4LjI0MWwtMS45NDcwNi0xLjQ4MTI3TDkuMjUyNDUsMTguODA5NTYsNy45MzI2MywxNi43Mzk3Miw2LjA0NjM0LDE4LjI0MWwtLjU0ODE1LTIuMzkzNjQtMi4yNzMzNi43NTA0NS4zMDUwOC0yLjQxNDktMi40MTQ0NC0uMDgxNTZMMi4yMzA5NCwxMS45MzA4LDAsMTEuMDM3NiwxLjgwNDY5LDkuMzc0LDAsNy43NzExM2wyLjI1MjExLS45NTM1NUwxLjExNTQ3LDQuNzA3MzksMy41NzAzLDQuNTg1ODIsMy4yMjQ4MiwyLjIxMTc2bDIuMzMzNzEuNzEwMDcuNDg3OC0yLjM1MzNMNy45OTQyNCwyLjA0OVptMCwyLjU3Njc4YTYuODI3Niw2LjgyNzYsMCwxLDEtNi44MzgsNi44Mzc1OSw2LjgyODQ2LDYuODI4NDYsMCwwLDEsNi44MzgtNi44Mzc1OVpNNS4xNTI3MywxNy4wODQzNSwzLjM2OCwyMy43NmwyLjE3MTM4LTEuNzY1MTgsMS40MTk3MSwyLjcxODczLDEuNTgzMy01Ljg4NEw3Ljc5MTEsMTcuNjUyNDYsNS42NjA1MiwxOS4zMTYwN1oiIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjbGluZWFyLWdyYWRpZW50KSIvPjxwYXRoIGQ9Ik02LjAxNzU3LDEwLjY0NDM4LDcsMTAuNTU4NDRhMi4xNzI1OSwyLjE3MjU5LDAsMCwwLC4zMjUyLjk2OTczLDEuNzY5LDEuNzY5LDAsMCwwLC43OTIuNjEyMywyLjk5MzI0LDIuOTkzMjQsMCwwLDAsMS4yMDkuMjMzNCwyLjg5NzMsMi44OTczLDAsMCwwLDEuMDUyNzMtLjE3Njc2LDEuNDY3ODYsMS40Njc4NiwwLDAsMCwuNjc5NjktLjQ4NjMzLDEuMTI4NjUsMS4xMjg2NSwwLDAsMCwuMjIyNjYtLjY3MzgzLDEuMDI5NTcsMS4wMjk1NywwLDAsMC0uMjE0ODQtLjY0NzQ2LDEuNTk5NDksMS41OTk0OSwwLDAsMC0uNzA5LS40NjQ4NCwxNC4wNzA3OCwxNC4wNzA3OCwwLDAsMC0xLjQwMjM0LS4zODM3OSw3LjIyMDYyLDcuMjIwNjIsMCwwLDEtMS41MTk1My0uNDkxMjEsMi4xMzUsMi4xMzUsMCwwLDEtLjg0MDgyLS43MzM0LDEuNzk0OSwxLjc5NDksMCwwLDEtLjI3NjM3LS45ODA0NywyLjAwMDI5LDIuMDAwMjksMCwwLDEsLjMzNzg5LTEuMTE0MjYsMi4xMDE3OSwyLjEwMTc5LDAsMCwxLC45ODgyOC0uNzg3MTEsMy43NTc4OCwzLjc1Nzg4LDAsMCwxLDEuNDQ1MzEtLjI2ODU1LDMuOTU1MjEsMy45NTUyMSwwLDAsMSwxLjU0Mzk1LjI4MjIzLDIuMjI0MTUsMi4yMjQxNSwwLDAsMSwxLjAyODMyLjgzMDA4LDIuMzc1NzksMi4zNzU3OSwwLDAsMSwuMzg2NzIsMS4yNDAyM2wtLjk5OS4wNzUyYTEuNjE1LDEuNjE1LDAsMCwwLS41NDQ5Mi0xLjEyNzkzQTIuMTI0MTMsMi4xMjQxMywwLDAsMCw5LjEzMjgsNi4wODQ4MWEyLjE5ODIsMi4xOTgyLDAsMCwwLTEuMzc3OTMuMzQ2NjgsMS4wMzgxMywxLjAzODEzLDAsMCwwLS40MzI2Mi44MzUuODk2NzUuODk2NzUsMCwwLDAsLjMwNjY0LjY5ODI0LDQuMTU1MTIsNC4xNTUxMiwwLDAsMCwxLjU3MTI5LjU2MTUyLDEwLjMyMSwxMC4zMjEsMCwwLDEsMS43NDIxOS41MDJBMi4zODI3NSwyLjM4Mjc1LDAsMCwxLDExLjk1OCw5LjgzMDlhMS45NjExOSwxLjk2MTE5LDAsMCwxLC4zMjcxNSwxLjEyMDEyLDIuMTQ4NDYsMi4xNDg0NiwwLDAsMS0uMzU5MzcsMS4xODQ1NywyLjM3NjMxLDIuMzc2MzEsMCwwLDEtMS4wMzQxOC44NjQyNiwzLjU5OTA4LDMuNTk5MDgsMCwwLDEtMS41MTc1OC4zMDg1OSw0LjUyNTE4LDQuNTI1MTgsMCwwLDEtMS43OTEtLjMxMTUyLDIuNTAxMTUsMi41MDExNSwwLDAsMS0xLjEzMjgxLS45MzY1MkEyLjY1MjQyLDIuNjUyNDIsMCwwLDEsNi4wMTc1NywxMC42NDQzOFoiIHN0eWxlPSJmaWxsOiNmZmYiLz48L2c+PC9nPjwvc3ZnPg==');
        }
    }

    &:nth-last-child(2) {
        .vn-history-mobile__badge {
            width: 24px;
            height: 24px;
            color: transparent;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTguNTA0NDgiIGhlaWdodD0iMjQuOTE2NjciIHZpZXdCb3g9IjAgMCAxOC41MDQ0OCAyNC45MTY2NyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSLmnKrlkb3lkI3mvLjlsaRfNTk4IiB4MT0iMi43NTk5OSIgeTE9IjMuNzkwMzIiIHgyPSIxOC45MzQ1MiIgeTI9IjE3Ljc1NzM5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYmM4OTJiIi8+PHN0b3Agb2Zmc2V0PSIwLjEwNjY3IiBzdG9wLWNvbG9yPSIjZjhjZTc1Ii8+PHN0b3Agb2Zmc2V0PSIwLjE0NTY3IiBzdG9wLWNvbG9yPSIjZjZjYzczIi8+PHN0b3Agb2Zmc2V0PSIwLjE2NjkxIiBzdG9wLWNvbG9yPSIjZjBjNTZiIi8+PHN0b3Agb2Zmc2V0PSIwLjE4Mzg3IiBzdG9wLWNvbG9yPSIjZTRiODVkIi8+PHN0b3Agb2Zmc2V0PSIwLjE5ODQ5IiBzdG9wLWNvbG9yPSIjZDRhNzRhIi8+PHN0b3Agb2Zmc2V0PSIwLjIxMTExIiBzdG9wLWNvbG9yPSIjYzE5MTMyIi8+PHN0b3Agb2Zmc2V0PSIwLjQyNzEiIHN0b3AtY29sb3I9IiNiYzg5MmIiLz48c3RvcCBvZmZzZXQ9IjAuNTYyOTciIHN0b3AtY29sb3I9IiNkOWIwNGUiLz48c3RvcCBvZmZzZXQ9IjAuNjk4OCIgc3RvcC1jb2xvcj0iI2Y4ZGI3NSIvPjxzdG9wIG9mZnNldD0iMC45NDcyNiIgc3RvcC1jb2xvcj0iIzliNjgyNiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2IzODQzNCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjx0aXRsZT7os4fnlKIgNDwvdGl0bGU+PGcgaWQ9IuWcluWxpF8yIiBkYXRhLW5hbWU9IuWcluWxpCAyIj48ZyBpZD0i5ZyW5bGkXzEtMiIgZGF0YS1uYW1lPSLlnJblsaQgMSI+PHBvbHlnb24gcG9pbnRzPSIxMy4zMyAxNy4xNjUgMTUuMTM2IDIzLjk2MyAxMi41MzggMjEuNzUxIDExLjU0NSAyNC45MTcgOS45MjEgMTguODkxIDEwLjY5MiAxNy42NTIgMTIuODg0IDE5LjMxNiAxMy4zMyAxNy4xNjUiIHN0eWxlPSJmaWxsOiNjMTI3MmQ7ZmlsbC1ydWxlOmV2ZW5vZGQiLz48cG9seWdvbiBwb2ludHM9IjUuMTUzIDE3LjA4NCAzLjM2OCAyMy43NiA1LjUzOSAyMS45OTUgNi45NTkgMjQuNzE0IDguNTQyIDE4LjgzIDcuNzkxIDE3LjY1MiA1LjY2MSAxOS4zMTYgNS4xNTMgMTcuMDg0IiBzdHlsZT0iZmlsbDojYzEyNzJkO2ZpbGwtcnVsZTpldmVub2RkIi8+PHBhdGggZD0iTTkuMjUyNDUsMy4xODU2OUE2LjIxODY4LDYuMjE4NjgsMCwxLDEsMy4wNDMzNiw5LjQxNDM3LDYuMjE2NTIsNi4yMTY1MiwwLDAsMSw5LjI1MjQ1LDMuMTg1NjlaTTkuMjUyNDUsMGwxLjMzODk0LDIuMDY5ODFMMTIuNDc3MjcuNTY4NTNsLjUyODYsMi4zOTM2NCwyLjI5MjkyLS43NTA0MUwxNC45OTM3LDQuNjI2MmwyLjM5NTMxLjA4MTE5TDE2LjI3MTkyLDYuODc4NzdsMi4yMzI1Ni44OTIzNkwxNi43MTkzMyw5LjQzNDc1bDEuNzg1MTUsMS42MDI4NS0yLjI1MjE1Ljk1NDM0LDEuMTM2NjgsMi4xMDk0LTIuNDM1Ny4xMjIzNy4zNDU0OCwyLjM3NDEtMi4zMzMzLS43MTAwN0wxMi40NzcyNywxOC4yNDFsLTEuOTQ3MDYtMS40ODEyN0w5LjI1MjQ1LDE4LjgwOTU2LDcuOTMyNjMsMTYuNzM5NzIsNi4wNDYzNCwxOC4yNDFsLS41NDgxNS0yLjM5MzY0LTIuMjczMzYuNzUwNDUuMzA1MDgtMi40MTQ5LTIuNDE0NDQtLjA4MTU2TDIuMjMwOTQsMTEuOTMwOCwwLDExLjAzNzYsMS44MDQ2OSw5LjM3NCwwLDcuNzcxMTNsMi4yNTIxMS0uOTUzNTVMMS4xMTU0Nyw0LjcwNzM5LDMuNTcwMyw0LjU4NTgyLDMuMjI0ODIsMi4yMTE3NmwyLjMzMzcxLjcxMDA3LjQ4NzgtMi4zNTMzTDcuOTk0MjQsMi4wNDlabTAsMi41NzY3OGE2LjgyNzYsNi44Mjc2LDAsMSwxLTYuODM4LDYuODM3NTksNi44Mjg0Niw2LjgyODQ2LDAsMCwxLDYuODM4LTYuODM3NTlaIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7ZmlsbDp1cmwoI+acquWRveWQjea8uOWxpF81OTgpIi8+PHBhdGggZD0iTTExLjc1NzU3LDEzLjIxNTU0SDcuMDg0NzJ2LS43OTk4SDguOTc1MzV2LTYuNTQybC0xLjkzODQ4LjU4NVY1LjU5NDQ0bDIuODM1OTQtLjg4NjcydjcuNzA4aDEuODg0NzdaIiBzdHlsZT0iZmlsbDojZmZmIi8+PHBhdGggZD0iTTExLjc1NzU3LDEzLjIxNTU0SDcuMDg0NzJ2LS43OTk4SDguOTc1MzV2LTYuNTQybC0xLjkzODQ4LjU4NVY1LjU5NDQ0bDIuODM1OTQtLjg4NjcydjcuNzA4aDEuODg0NzdaIiBzdHlsZT0iZmlsbDojZmZmIi8+PC9nPjwvZz48L3N2Zz4=');
        }
    }

    &:nth-last-child(3) {
        .vn-history-mobile__badge {
            width: 24px;
            height: 24px;
            color: transparent;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTguNTA0NDgiIGhlaWdodD0iMjQuOTE2NjciIHZpZXdCb3g9IjAgMCAxOC41MDQ0OCAyNC45MTY2NyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSLmnKrlkb3lkI3mvLjlsaRfNjk0IiB4MT0iMTUuODc2ODEiIHkxPSIxNi4wMTk3OCIgeDI9IjIuNjQ2ODEiIHkyPSIyLjc4OTc4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjBlZWViIi8+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZTFlMGRlIi8+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjY2NjIi8+PHN0b3Agb2Zmc2V0PSIwLjEwNTA4IiBzdG9wLWNvbG9yPSIjYmZiZGJmIi8+PHN0b3Agb2Zmc2V0PSIwLjMwNTk1IiBzdG9wLWNvbG9yPSIjOWI5NjliIi8+PHN0b3Agb2Zmc2V0PSIwLjMxMjkzIiBzdG9wLWNvbG9yPSIjOWE5NTlhIi8+PHN0b3Agb2Zmc2V0PSIwLjMxODQ4IiBzdG9wLWNvbG9yPSIjOWQ5ODlkIi8+PHN0b3Agb2Zmc2V0PSIwLjMyMjIyIiBzdG9wLWNvbG9yPSIjYTVhMGE0Ii8+PHN0b3Agb2Zmc2V0PSIwLjQ3ODAxIiBzdG9wLWNvbG9yPSIjYzZjNWM1Ii8+PHN0b3Agb2Zmc2V0PSIwLjUwNjY3IiBzdG9wLWNvbG9yPSIjY2NjIi8+PHN0b3Agb2Zmc2V0PSIwLjY5MTExIiBzdG9wLWNvbG9yPSJncmF5Ii8+PHN0b3Agb2Zmc2V0PSIwLjc0IiBzdG9wLWNvbG9yPSIjYTZhNmE2Ii8+PHN0b3Agb2Zmc2V0PSIwLjg3NTU2IiBzdG9wLWNvbG9yPSIjYjNiM2IzIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHRpdGxlPuizh+eUoiA1PC90aXRsZT48ZyBpZD0i5ZyW5bGkXzIiIGRhdGEtbmFtZT0i5ZyW5bGkIDIiPjxnIGlkPSLlnJblsaRfMS0yIiBkYXRhLW5hbWU9IuWcluWxpCAxIj48cG9seWdvbiBwb2ludHM9IjEzLjMzIDE3LjE2NSAxNS4xMzYgMjMuOTYzIDEyLjUzOCAyMS43NTEgMTEuNTQ1IDI0LjkxNyA5LjkyMSAxOC44OTEgMTAuNjkyIDE3LjY1MiAxMi44ODQgMTkuMzE2IDEzLjMzIDE3LjE2NSIgc3R5bGU9ImZpbGw6IzRkNGQ0ZDtmaWxsLXJ1bGU6ZXZlbm9kZCIvPjxwb2x5Z29uIHBvaW50cz0iNS4xNTMgMTcuMDg0IDMuMzY4IDIzLjc2IDUuNTM5IDIxLjk5NSA2Ljk1OSAyNC43MTQgOC41NDIgMTguODMgNy43OTEgMTcuNjUyIDUuNjYxIDE5LjMxNiA1LjE1MyAxNy4wODQiIHN0eWxlPSJmaWxsOiM0ZDRkNGQ7ZmlsbC1ydWxlOmV2ZW5vZGQiLz48cGF0aCBkPSJNOS4yNTI0NSwzLjE4NTY5QTYuMjE4NjgsNi4yMTg2OCwwLDEsMSwzLjA0MzM2LDkuNDE0MzcsNi4yMTY1Miw2LjIxNjUyLDAsMCwxLDkuMjUyNDUsMy4xODU2OVpNOS4yNTI0NSwwbDEuMzM4OTQsMi4wNjk4MUwxMi40NzcyNy41Njg1M2wuNTI4NiwyLjM5MzY0LDIuMjkyOTItLjc1MDQxTDE0Ljk5MzcsNC42MjYybDIuMzk1MzEuMDgxMTlMMTYuMjcxOTIsNi44Nzg3N2wyLjIzMjU2Ljg5MjM2TDE2LjcxOTMzLDkuNDM0NzVsMS43ODUxNSwxLjYwMjg1LTIuMjUyMTUuOTU0MzQsMS4xMzY2OCwyLjEwOTQtMi40MzU3LjEyMjM3LjM0NTQ4LDIuMzc0MS0yLjMzMzMtLjcxMDA3TDEyLjQ3NzI3LDE4LjI0MWwtMS45NDcwNi0xLjQ4MTI3TDkuMjUyNDUsMTguODA5NTYsNy45MzI2MywxNi43Mzk3Miw2LjA0NjM0LDE4LjI0MWwtLjU0ODE1LTIuMzkzNjQtMi4yNzMzNi43NTA0NS4zMDUwOC0yLjQxNDktMi40MTQ0NC0uMDgxNTZMMi4yMzA5NCwxMS45MzA4LDAsMTEuMDM3NiwxLjgwNDY5LDkuMzc0LDAsNy43NzExM2wyLjI1MjExLS45NTM1NUwxLjExNTQ3LDQuNzA3MzksMy41NzAzLDQuNTg1ODIsMy4yMjQ4MiwyLjIxMTc2bDIuMzMzNzEuNzEwMDcuNDg3OC0yLjM1MzNMNy45OTQyNCwyLjA0OVptMCwyLjU3Njc4YTYuODI3Niw2LjgyNzYsMCwxLDEtNi44MzgsNi44Mzc1OSw2LjgyODQ2LDYuODI4NDYsMCwwLDEsNi44MzgtNi44Mzc1OVoiIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgj5pyq5ZG95ZCN5ry45bGkXzY5NCkiLz48cGF0aCBkPSJNMTEuNjc0NDYsMTMuMjY0MThINi42MjU2M3YtLjgyMjI3TDkuMDgxNjksOS45NjkyNWE5LjEyNTI3LDkuMTI1MjcsMCwwLDAsMS41MDEtMS43ODMyLDIuNTY2MzgsMi41NjYzOCwwLDAsMCwuMjgwMjctMS4xNzM4MywxLjUxNTIzLDEuNTE1MjMsMCwwLDAtLjQyMTg3LTEuMTQ5NDEsMS42ODc3NywxLjY4Nzc3LDAsMCwwLTEuMjExOTEtLjQwMzMyLDMuMTU1NTUsMy4xNTU1NSwwLDAsMC0yLjE2OC45NzU1OVY1LjQ2NTM1QTMuNTU2MiwzLjU1NjIsMCwwLDEsOS4zNDkyNiw0LjY4N2EyLjQ3MzUyLDIuNDczNTIsMCwwLDEsMS43NDUxMi42MDQ0OSwyLjExNzY4LDIuMTE3NjgsMCwwLDEsLjY1NjI1LDEuNjM4NjdBMy4xNzA4MiwzLjE3MDgyLDAsMCwxLDExLjMxOCw4LjQ5NjYsMTAuMTcxNDMsMTAuMTcxNDMsMCwwLDEsOS42ODEzLDEwLjQ3MDIzTDcuNzE1NDgsMTIuNDE0NTdWMTIuNDM3aDMuOTU5WiIgc3R5bGU9ImZpbGw6I2ZmZiIvPjxwYXRoIGQ9Ik0xMS42NzQ0NiwxMy4yNjQxOEg2LjYyNTYzdi0uODIyMjdMOS4wODE2OSw5Ljk2OTI1YTkuMTI1MjcsOS4xMjUyNywwLDAsMCwxLjUwMS0xLjc4MzIsMi41NjYzOCwyLjU2NjM4LDAsMCwwLC4yODAyNy0xLjE3MzgzLDEuNTE1MjMsMS41MTUyMywwLDAsMC0uNDIxODctMS4xNDk0MSwxLjY4Nzc3LDEuNjg3NzcsMCwwLDAtMS4yMTE5MS0uNDAzMzIsMy4xNTU1NSwzLjE1NTU1LDAsMCwwLTIuMTY4Ljk3NTU5VjUuNDY1MzVBMy41NTYyLDMuNTU2MiwwLDAsMSw5LjM0OTI2LDQuNjg3YTIuNDczNTIsMi40NzM1MiwwLDAsMSwxLjc0NTEyLjYwNDQ5LDIuMTE3NjgsMi4xMTc2OCwwLDAsMSwuNjU2MjUsMS42Mzg2N0EzLjE3MDgyLDMuMTcwODIsMCwwLDEsMTEuMzE4LDguNDk2NiwxMC4xNzE0MywxMC4xNzE0MywwLDAsMSw5LjY4MTMsMTAuNDcwMjNMNy43MTU0OCwxMi40MTQ1N1YxMi40MzdoMy45NTlaIiBzdHlsZT0iZmlsbDojZmZmIi8+PC9nPjwvZz48L3N2Zz4=');
        }
    }

    &:nth-last-child(4) {
        .vn-history-mobile__badge {
            width: 24px;
            height: 24px;
            color: transparent;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTguNTA0NDgiIGhlaWdodD0iMjQuOTE2NjciIHZpZXdCb3g9IjAgMCAxOC41MDQ0OCAyNC45MTY2NyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSLmnKrlkb3lkI3mvLjlsaRfNjE2IiB4MT0iMi41NzA2IiB5MT0iMy42NjA0NCIgeDI9IjE1LjgyMDYiIHkyPSIxNS4wMzU0NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzliNzIyNiIvPjxzdG9wIG9mZnNldD0iMC4xNjk4MyIgc3RvcC1jb2xvcj0iIzY1MzMwNSIvPjxzdG9wIG9mZnNldD0iMC4yNzgxNiIgc3RvcC1jb2xvcj0iIzY3MzUwNSIvPjxzdG9wIG9mZnNldD0iMC4zMTcxOCIgc3RvcC1jb2xvcj0iIzZkM2MwNyIvPjxzdG9wIG9mZnNldD0iMC4zNDQ5OCIgc3RvcC1jb2xvcj0iIzc4NDcwYSIvPjxzdG9wIG9mZnNldD0iMC4zNjczMSIgc3RvcC1jb2xvcj0iIzg4NTgwZCIvPjxzdG9wIG9mZnNldD0iMC4zODI2NSIgc3RvcC1jb2xvcj0iIzk4NjkxMSIvPjxzdG9wIG9mZnNldD0iMC41MTk4OSIgc3RvcC1jb2xvcj0iI2Q2OTE1YiIvPjxzdG9wIG9mZnNldD0iMC43NTYxNSIgc3RvcC1jb2xvcj0iIzc5NGEwZCIvPjxzdG9wIG9mZnNldD0iMC44Nzc4OCIgc3RvcC1jb2xvcj0iIzkwNjQxYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjx0aXRsZT7os4fnlKIgNjwvdGl0bGU+PGcgaWQ9IuWcluWxpF8yIiBkYXRhLW5hbWU9IuWcluWxpCAyIj48ZyBpZD0i5ZyW5bGkXzEtMiIgZGF0YS1uYW1lPSLlnJblsaQgMSI+PHBvbHlnb24gcG9pbnRzPSIxMy4zMyAxNy4xNjUgMTUuMTM2IDIzLjk2MyAxMi41MzggMjEuNzUxIDExLjU0NSAyNC45MTcgOS45MjEgMTguODkxIDEwLjY5MiAxNy42NTIgMTIuODg0IDE5LjMxNiAxMy4zMyAxNy4xNjUiIHN0eWxlPSJmaWxsOiNkYjVmNDI7ZmlsbC1ydWxlOmV2ZW5vZGQiLz48cG9seWdvbiBwb2ludHM9IjUuMTUzIDE3LjA4NCAzLjM2OCAyMy43NiA1LjUzOSAyMS45OTUgNi45NTkgMjQuNzE0IDguNTQyIDE4LjgzIDcuNzkxIDE3LjY1MiA1LjY2MSAxOS4zMTYgNS4xNTMgMTcuMDg0IiBzdHlsZT0iZmlsbDojZGI1ZjQyO2ZpbGwtcnVsZTpldmVub2RkIi8+PHBhdGggZD0iTTkuMjUyNDUsMy4xODU2OUE2LjIxODY4LDYuMjE4NjgsMCwxLDEsMy4wNDMzNiw5LjQxNDM3LDYuMjE2NTIsNi4yMTY1MiwwLDAsMSw5LjI1MjQ1LDMuMTg1NjlaTTkuMjUyNDUsMGwxLjMzODk0LDIuMDY5ODFMMTIuNDc3MjcuNTY4NTNsLjUyODYsMi4zOTM2NCwyLjI5MjkyLS43NTA0MUwxNC45OTM3LDQuNjI2MmwyLjM5NTMxLjA4MTE5TDE2LjI3MTkyLDYuODc4NzdsMi4yMzI1Ni44OTIzNkwxNi43MTkzMyw5LjQzNDc1bDEuNzg1MTUsMS42MDI4NS0yLjI1MjE1Ljk1NDM0LDEuMTM2NjgsMi4xMDk0LTIuNDM1Ny4xMjIzNy4zNDU0OCwyLjM3NDEtMi4zMzMzLS43MTAwN0wxMi40NzcyNywxOC4yNDFsLTEuOTQ3MDYtMS40ODEyN0w5LjI1MjQ1LDE4LjgwOTU2LDcuOTMyNjMsMTYuNzM5NzIsNi4wNDYzNCwxOC4yNDFsLS41NDgxNS0yLjM5MzY0LTIuMjczMzYuNzUwNDUuMzA1MDgtMi40MTQ5LTIuNDE0NDQtLjA4MTU2TDIuMjMwOTQsMTEuOTMwOCwwLDExLjAzNzYsMS44MDQ2OSw5LjM3NCwwLDcuNzcxMTNsMi4yNTIxMS0uOTUzNTVMMS4xMTU0Nyw0LjcwNzM5LDMuNTcwMyw0LjU4NTgyLDMuMjI0ODIsMi4yMTE3NmwyLjMzMzcxLjcxMDA3LjQ4NzgtMi4zNTMzTDcuOTk0MjQsMi4wNDlabTAsMi41NzY3OGE2LjgyNzYsNi44Mjc2LDAsMSwxLTYuODM4LDYuODM3NTksNi44Mjg0Niw2LjgyODQ2LDAsMCwxLDYuODM4LTYuODM3NTlaIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7ZmlsbDp1cmwoI+acquWRveWQjea8uOWxpF82MTYpIi8+PHBhdGggZD0iTTcuMzMxNDIsMTEuOTE1OTRhMy4wMTU1MywzLjAxNTUzLDAsMCwwLDEuOTIyODUuNjc2NzYsMi4xNjMyMiwyLjE2MzIyLDAsMCwwLDEuMzk5NDEtLjQzNTU1LDEuNDU1LDEuNDU1LDAsMCwwLC41MzkwNi0xLjE5NzI3cTAtMS42NjU1My0yLjM0NjY4LTEuNjY1aC0uNjg3NVY4LjUyNjI5aC42NTUyN3EyLjA4MywwLDIuMDg0LTEuNTU3NjIsMC0xLjQ0NDM0LTEuNTg5ODQtMS40NDQzNGEyLjYzMjEsMi42MzIxLDAsMCwwLTEuNjU0My42MDY0NVY1LjIzNDNhMy41NzA0NCwzLjU3MDQ0LDAsMCwxLDEuODc5ODgtLjQ3ODUyLDIuNDU4MTQsMi40NTgxNCwwLDAsMSwxLjYzNTc0LjU0MywxLjc4NDkxLDEuNzg0OTEsMCwwLDEsLjY0NjQ4LDEuNDM5NDUsMi4wNDg2NCwyLjA0ODY0LDAsMCwxLTEuNjY5OTIsMi4xMTYyMVY4Ljg3NTlhMi4xODIzOCwyLjE4MjM4LDAsMCwxLDEuNDI1NzguNjIzLDEuODYzNDIsMS44NjM0MiwwLDAsMSwuNTQsMS4zNjQyNiwyLjIzNSwyLjIzNSwwLDAsMS0uODE5MzQsMS44MTU0MywzLjE3NDM5LDMuMTc0MzksMCwwLDEtMi4wOTE4LjY3Njc2LDMuNDI5MTYsMy40MjkxNiwwLDAsMS0xLjg2OTE0LS40NDYyOVoiIHN0eWxlPSJmaWxsOiNmZmYiLz48cGF0aCBkPSJNNy4zMzE0MiwxMS45MTU5NGEzLjAxNTUzLDMuMDE1NTMsMCwwLDAsMS45MjI4NS42NzY3NiwyLjE2MzIyLDIuMTYzMjIsMCwwLDAsMS4zOTk0MS0uNDM1NTUsMS40NTUsMS40NTUsMCwwLDAsLjUzOTA2LTEuMTk3MjdxMC0xLjY2NTUzLTIuMzQ2NjgtMS42NjVoLS42ODc1VjguNTI2MjloLjY1NTI3cTIuMDgzLDAsMi4wODQtMS41NTc2MiwwLTEuNDQ0MzQtMS41ODk4NC0xLjQ0NDM0YTIuNjMyMSwyLjYzMjEsMCwwLDAtMS42NTQzLjYwNjQ1VjUuMjM0M2EzLjU3MDQ0LDMuNTcwNDQsMCwwLDEsMS44Nzk4OC0uNDc4NTIsMi40NTgxNCwyLjQ1ODE0LDAsMCwxLDEuNjM1NzQuNTQzLDEuNzg0OTEsMS43ODQ5MSwwLDAsMSwuNjQ2NDgsMS40Mzk0NSwyLjA0ODY0LDIuMDQ4NjQsMCwwLDEtMS42Njk5MiwyLjExNjIxVjguODc1OWEyLjE4MjM4LDIuMTgyMzgsMCwwLDEsMS40MjU3OC42MjMsMS44NjM0MiwxLjg2MzQyLDAsMCwxLC41NCwxLjM2NDI2LDIuMjM1LDIuMjM1LDAsMCwxLS44MTkzNCwxLjgxNTQzLDMuMTc0MzksMy4xNzQzOSwwLDAsMS0yLjA5MTguNjc2NzYsMy40MjkxNiwzLjQyOTE2LDAsMCwxLTEuODY5MTQtLjQ0NjI5WiIgc3R5bGU9ImZpbGw6I2ZmZiIvPjwvZz48L2c+PC9zdmc+');
        }
    }
}
</style>
