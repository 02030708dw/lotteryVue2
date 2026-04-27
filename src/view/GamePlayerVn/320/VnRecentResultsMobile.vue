<template>
    <transition
        name="vn-recent-slide"
        @before-enter="handleBeforeEnter"
        @enter="handleEnter"
        @after-enter="clearTransitionStyles"
        @before-leave="handleBeforeLeave"
        @leave="handleLeave"
        @after-leave="handleAfterLeave"
    >
        <div class="vn-recent" v-show="visible">
            <div class="vn-recent__panel" ref="panel">
                <div class="vn-recent__header">
                    <button
                        class="vn-recent__nav"
                        :class="{ 'is-disabled': !hasOlder }"
                        @click.stop="goOlder"
                    >
                        <i class="el-icon-arrow-left"></i>
                    </button>
                    <div class="vn-recent__issue">{{ currentIssue }}</div>
                    <button
                        class="vn-recent__nav"
                        :class="{ 'is-disabled': !hasNewer }"
                        @click.stop="goNewer"
                    >
                        <i class="el-icon-arrow-right"></i>
                    </button>
                </div>

                <div class="vn-recent__body" v-if="currentDraw">
                    <div class="vn-recent__results">
                        <div
                            v-for="(row, index) in currentDraw.rows"
                            :key="row.label"
                            class="vn-recent__result-row"
                            :class="{ 'is-alt': index % 2 === 1 }"
                        >
                            <div class="vn-recent__label">{{ row.label }}</div>
                            <div class="vn-recent__numbers">
                                <template v-if="row.numbers.length">
                                    <template v-for="(number, numberIndex) in row.numbers">
                                        <span
                                            :key="`${row.label}-${numberIndex}`"
                                            class="vn-recent__number"
                                        >
                                            <span class="vn-recent__head">
                                                <template v-for="(char, charIndex) in formatDisplayNumber(number).head.split('')">
                                                    <span
                                                        :key="`${row.label}-${numberIndex}-head-${charIndex}-${rollVersion}`"
                                                        class="vn-recent__digit-window"
                                                    >
                                                        <span
                                                            v-if="isRolling && isDigit(char)"
                                                            class="vn-recent__digit-roll"
                                                            :style="getRollStyle(char, index, numberIndex, charIndex)"
                                                        >
                                                            <span
                                                                v-for="(digit, digitIndex) in getRollingDigits(char, index, numberIndex, charIndex)"
                                                                :key="`${row.label}-${numberIndex}-head-${charIndex}-${digitIndex}`"
                                                                class="vn-recent__digit"
                                                            >{{ digit }}</span>
                                                        </span>
                                                        <span v-else class="vn-recent__digit">{{ char }}</span>
                                                    </span>
                                                </template>
                                            </span><span class="vn-recent__tail">
                                                <template v-for="(char, charIndex) in formatDisplayNumber(number).tail.split('')">
                                                    <span
                                                        :key="`${row.label}-${numberIndex}-tail-${charIndex}-${rollVersion}`"
                                                        class="vn-recent__digit-window"
                                                    >
                                                        <span
                                                            v-if="isRolling && isDigit(char)"
                                                            class="vn-recent__digit-roll"
                                                            :style="getRollStyle(char, index, numberIndex, charIndex + formatDisplayNumber(number).head.length)"
                                                        >
                                                            <span
                                                                v-for="(digit, digitIndex) in getRollingDigits(char, index, numberIndex, charIndex + formatDisplayNumber(number).head.length)"
                                                                :key="`${row.label}-${numberIndex}-tail-${charIndex}-${digitIndex}`"
                                                                class="vn-recent__digit"
                                                            >{{ digit }}</span>
                                                        </span>
                                                        <span v-else class="vn-recent__digit">{{ char }}</span>
                                                    </span>
                                                </template>
                                            </span>
                                        </span>
                                        <span
                                            v-if="numberIndex !== row.numbers.length - 1"
                                            :key="`${row.label}-${numberIndex}-separator`"
                                            class="vn-recent__separator"
                                        >-</span>
                                    </template>
                                </template>
                                <span v-else class="vn-recent__placeholder">-</span>
                            </div>
                        </div>
                    </div>

                    <div class="vn-recent__stats">
                        <div class="vn-recent__stats-head">
                            <div class="vn-recent__stats-cell">tens</div>
                            <div class="vn-recent__stats-cell">Unit</div>
                        </div>
                        <div
                            v-for="row in currentDraw.stats"
                            :key="row.tens"
                            class="vn-recent__stats-row"
                        >
                            <div class="vn-recent__stats-cell vn-recent__stats-cell--tens">{{ row.tens }}</div>
                            <div class="vn-recent__stats-cell">{{ row.units.join(',') }}</div>
                        </div>
                    </div>
                </div>

                <div v-else class="vn-recent__empty">{{ $t('bettingrc_031') }}</div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatVNBingoCode } from '@UTIL/games/VN'

const DISPLAY_LABELS = ['S', '1', '2', '3', '4', '5', '6', '7', '8']

export default {
    name: 'VnRecentResultsMobile',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        handleToggle: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            currentIndex: 0,
            isRolling: false,
            rollVersion: 0,
            rollTimer: null
        }
    },
    computed: {
        ...mapGetters(['VN_lastNumber_V2']),
        drawList() {
            const source = Array.isArray(this.VN_lastNumber_V2)
                ? this.VN_lastNumber_V2
                : []

            return source
                .map(item => this.normalizeDraw(item))
                .filter(item => item.rows.some(row => row.numbers.length))
        },
        currentDraw() {
            return this.drawList[this.currentIndex] || null
        },
        currentIssue() {
            return (this.currentDraw || {}).issue || '--'
        },
        hasOlder() {
            return this.currentIndex < this.drawList.length - 1
        },
        hasNewer() {
            return this.currentIndex > 0
        },
        currentDrawRollKey() {
            const draw = this.currentDraw
            if (!draw) return ''
            return `${draw.issue}|${draw.rows.map(row => row.numbers.join(',')).join('|')}`
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.currentIndex = 0
                this.startRolling()
            } else {
                this.stopRolling()
            }
        },
        drawList(list) {
            if (!list.length) {
                this.currentIndex = 0
                return
            }
            if (this.currentIndex > list.length - 1) {
                this.currentIndex = list.length - 1
            }
        },
        currentDrawRollKey(val, oldVal) {
            if (!this.visible || !val || val === oldVal) return
            this.startRolling()
        }
    },
    beforeDestroy() {
        this.stopRolling()
    },
    methods: {
        getCollapsedHeight() {
            return 62
        },
        goOlder() {
            if (!this.hasOlder) return
            this.currentIndex += 1
        },
        goNewer() {
            if (!this.hasNewer) return
            this.currentIndex -= 1
        },
        startRolling() {
            if (!this.currentDraw) return
            clearTimeout(this.rollTimer)
            this.rollVersion += 1
            this.isRolling = true
            this.rollTimer = setTimeout(() => {
                this.isRolling = false
            }, 3000)
        },
        stopRolling() {
            clearTimeout(this.rollTimer)
            this.rollTimer = null
            this.isRolling = false
        },
        normalizeDraw(item = {}) {
            const rows = this.buildRows(item.code)

            return {
                issue: item.issue || '',
                rows,
                stats: this.buildStats(rows)
            }
        },
        buildRows(code) {
            const formatted = formatVNBingoCode(code || '')
            const normalizedRows = Array.isArray(formatted)
                ? formatted.slice().reverse()
                : []

            return DISPLAY_LABELS.map((label, index) => {
                const rowNumbers = normalizedRows[index]
                return {
                    label,
                    numbers: Array.isArray(rowNumbers)
                        ? rowNumbers.map(number => String(number || '').trim()).filter(Boolean)
                        : []
                }
            })
        },
        buildStats(rows) {
            const buckets = Array.from({ length: 10 }, (_, tens) => ({
                tens: `${tens}`,
                units: []
            }))

            rows.forEach((row) => {
                row.numbers.forEach((number) => {
                    const tail = this.getStatTail(number)
                    const tens = +tail.charAt(0)
                    const unit = tail.charAt(1)

                    if (Number.isNaN(tens) || unit === '') return
                    buckets[tens].units.push(unit)
                })
            })

            return buckets
        },
        getStatTail(number) {
            const digits = String(number || '').replace(/\D/g, '')
            return digits.slice(-2).padStart(2, '0')
        },
        formatDisplayNumber(number) {
            const digits = String(number || '').replace(/\D/g, '')
            if (!digits) {
                return { head: '', tail: '--' }
            }
            if (digits.length <= 2) {
                return { head: '', tail: digits }
            }

            return {
                head: digits.slice(0, -2),
                tail: digits.slice(-2)
            }
        },
        isDigit(char) {
            return /\d/.test(char)
        },
        getRollingDigits(char, rowIndex, numberIndex, charIndex) {
            if (!this.isDigit(char)) return [char]

            const target = +char
            const start = (this.rollVersion + rowIndex + numberIndex + charIndex) % 10
            const total = 24 + ((rowIndex + numberIndex + charIndex) % 8)
            const digits = []

            for (let index = 0; index < total; index += 1) {
                digits.push(`${(start + index) % 10}`)
            }

            digits.push(`${target}`)
            return digits
        },
        getRollStyle(char, rowIndex, numberIndex, charIndex) {
            const offset = this.getRollingDigits(char, rowIndex, numberIndex, charIndex).length - 1
            const order = (numberIndex * 6) + charIndex
            const delay = Math.min(order * 0.08, 0.72)
            const duration = Math.max(2.2, 3 - delay)

            return {
                '--offset': offset,
                '--delay': `${delay}s`,
                '--duration': `${duration}s`
            }
        },
        waitForHeightTransition(el, done) {
            const onEnd = (event) => {
                if (event.target !== el || event.propertyName !== 'height') return
                el.removeEventListener('transitionend', onEnd)
                done()
            }

            el.addEventListener('transitionend', onEnd)
        },
        handleBeforeEnter(el) {
            el.style.height = `${this.getCollapsedHeight()}px`
        },
        handleEnter(el, done) {
            void el.offsetHeight
            el.style.height = `${el.scrollHeight}px`
            this.waitForHeightTransition(el, done)
        },
        handleBeforeLeave(el) {
            this.$emit('transitioning', true)
            el.style.height = `${el.scrollHeight}px`
        },
        handleLeave(el, done) {
            void el.offsetHeight
            el.style.height = `${this.getCollapsedHeight()}px`
            this.waitForHeightTransition(el, done)
        },
        clearTransitionStyles(el) {
            el.style.height = ''
        },
        handleAfterLeave(el) {
            this.clearTransitionStyles(el)
            this.$emit('transitioning', false)
        }
    }
}
</script>

<style scoped lang="scss">
.vn-recent-slide-enter-active,
.vn-recent-slide-leave-active {
    transition: height 0.24s ease;
    overflow: hidden;
    will-change: height;
}

.vn-recent {
    width: 100%;
    padding-top: 62px;
    background: #fff;
    box-sizing: border-box;
}

.vn-recent__panel {
    background: #fff;
    border-top: 1px solid #d7d7d7;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.vn-recent__header {
    height: 36px;
    display: flex;
    align-items: center;
    background: #4d4a49;
    color: #fff;
}

.vn-recent__issue {
    flex: 1;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.01em;
}

.vn-recent__nav {
    width: 34px;
    height: 36px;
    border: 0;
    background: transparent;
    color: #d5cbc0;
    font-size: 16px;

    &.is-disabled {
        opacity: 0.35;
    }
}

.vn-recent__body {
    display: flex;
    align-items: stretch;
}

.vn-recent__results {
    flex: 1 1 60%;
    border-right: 1px solid #d7d7d7;
    background: #f7f7f7;
}

.vn-recent__result-row {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid #ececec;
    background: #f7f7f7;

    &.is-alt {
        background: #efefef;
    }
}

.vn-recent__label {
    width: 42px;
    flex: 0 0 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #111;
    border-right: 1px solid rgba(255, 255, 255, 0.8);
}

.vn-recent__numbers {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 3px 6px;
    line-height: 1.3;
    font-size: 11px;
    color: #444;
    text-align: center;
}

.vn-recent__number {
    white-space: nowrap;
}

.vn-recent__digit-window {
    display: inline-flex;
    overflow: hidden;
    height: 1em;
    line-height: 1;
    vertical-align: top;
}

.vn-recent__digit-roll {
    display: flex;
    flex-direction: column;
    animation: vn-recent-digit-roll var(--duration, 3s) cubic-bezier(0.16, 0.78, 0.18, 1) forwards;
    animation-delay: var(--delay, 0s);
    will-change: transform;
}

.vn-recent__digit {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1em;
    line-height: 1;
}

.vn-recent__head {
    color: #444;
}

.vn-recent__tail {
    color: #179824;
    font-weight: 700;
}

.vn-recent__separator {
    margin: 0 1px;
    color: #666;
}

.vn-recent__placeholder {
    color: #aaa;
}

.vn-recent__stats {
    width: 40%;
    min-width: 122px;
    display: flex;
    flex-direction: column;
    background: #b7cff3;
}

.vn-recent__stats-head,
.vn-recent__stats-row {
    display: grid;
    grid-template-columns: 48px 1fr;
    flex: 1 1 0;
    min-height: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.92);
}

.vn-recent__stats-head {
    background: #aac6ec;
}

.vn-recent__stats-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    color: #111;
    font-size: 13px;
    text-align: center;
}

.vn-recent__stats-cell--tens {
    border-right: 1px solid rgba(255, 255, 255, 0.92);
}

.vn-recent__stats-head .vn-recent__stats-cell:first-child {
    border-right: 1px solid rgba(255, 255, 255, 0.92);
}

.vn-recent__empty {
    padding: 24px 0;
    text-align: center;
    color: #999;
    font-size: 13px;
}

@keyframes vn-recent-digit-roll {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(calc(var(--offset) * -1em));
    }
}
</style>
