<template>
    <div class="c_slider">
        <span
            v-inputValue="inputValue"
            class="c_slider-point"
        >
            <div class="c_slider__input  c_input--shortest" v-if="RWDMode === 1">
                <input
                    class="c_input__inner"
                    type="tel"
                    :value="inputValue"
                    @input="setInputValue"
                    @click="handleInputClick"
                    @blur="handleInputValue"
                >
            </div>
            <template v-else>
                {{inputValue}}
            </template>
            %
        </span>
        <span class="c_slider-bar">
            <span
                @mousedown="handleKeepPoint($event, - 0.1)"
                @touchstart="handleKeepPoint($event, - 0.1)"
                class="c_slider-bar__minus"
            >
                -
            </span>
            <span
                ref="track"
                class="c_slider-bar__track"
                @mousedown="handleClick"
                @touchstart="handleClick"
            >
                <span
                    class="c_track__line"
                    :style="{width}"
                >
                    <span class="c_track__thumb" />
                </span>
            </span>
            <span
                @mousedown="handleKeepPoint($event, 0.1)"
                @touchstart="handleKeepPoint($event, 0.1)"
                class="c_slider-bar__plus"
            >
                +
            </span>
            <span
                :class="['c_slider-bar__tooltip', {'is_active': isClick || isPress}]"
            >
                {{(floatPrize.keepPoint * 100 - keepPoint).toFixed(1) + '%'}}
                <template v-if="hprize">
                     /
                    {{hprize}}
                </template>
            </span>
        </span>
        <slot>
            <!-- hprize -->
            <span
                class="c_slider-prize"
                :class="{ is_strong: prizeIsUpdated }"
                v-if="hprize"
            >
                <template v-for="(prize, i) in splitHprize">
                    <strong v-if="i">|</strong>
                    {{prize}}
                </template>
            </span>
        </slot>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { requestAFrame, cancelAFrame } from '@UTIL/animationFrame'
import { formatNumber } from '@UTIL'
export default {
    name: 'InputRange',
    data() {
        return {
            // 返點浮動按鈕是否按住
            isClick: false,
            // 返點 + - 按鈕是否按住
            isPress: false,
            //按壓計時
            pressTimer: null,
            //返點變更速度
            timer: null,
            //返點變更速度計數
            timerCount: 0,
            //計算按壓時間
            pressTime: 0,
            // 獎金組: 趴數
            pointMap: {},
            // 趴數: 寬度
            percentMap: {},
            inputValue: ''
        }
    },
    props: {
        hprize: String
    },
    created() {
        window.addEventListener('resize', this.setTrackX, false)
        this.$root.$on('onInputValue', this.onInputValue)
    },
    mounted() {
        this.initSet()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.setTrackX, false)
        this.$root.$off('onInputValue', this.onInputValue)
    },
    watch: {
        '$i18n.locale'() {
            this.RWDMode === 1 && this.setTrackX()
        }
    },
    methods: {
        ...mapActions([
            _M.SET_KEEP_POINT
        ]),
        initSet() {
            const refTrack = this.$refs.track
            if(refTrack === undefined) return setTimeout(this.initSet, 100)
            const { width, left } = refTrack.getBoundingClientRect()
            if (!width && !left) {
                return setTimeout(this.initSet, 100)
            }
            this.trackWidth = width
            this.trackX = left
            const max = this.floatPrize.keepPoint * 1000 + 1
            const length = width / max
            ;[...Array(max).keys()].forEach((n) => {
                const point = (n * 0.1).toFixed(1)
                const percent = Math.round(length * n, 0)
                this.$set(this.pointMap, point, percent)
                this.percentMap[percent] = point
            })
            ;[...Array(~~width + 1).keys()].forEach((n) => {
                !this.percentMap[n] && (this.percentMap[n] = this.percentMap[n - 1])
            })
            this.percentMap[0] = '0.0'
            this.timer = requestAFrame(this.backgroundCalc)
            document.addEventListener('touchend', this.handleClickOut, false)
            document.addEventListener('mouseup', this.handleClickOut, false)
            this.handleInputValue()
        },
        beforeDestroy() {
            cancelAFrame(this.timer)
            clearTimeout(this.pressTimer)
            document.removeEventListener('touchend', this.handleClickOut, false)
            document.removeEventListener('mouseup', this.handleClickOut, false)
        },
        setTrackX() {
            const { left } = this.$refs.track.getBoundingClientRect()
            left && (this.trackX = left)
        },
        handleKeepPoint(e, val) {
            e.preventDefault()
            this.pressTimer = setTimeout(() => {
                this.isPress = val
                this.pressTime = +new Date()
            }, 250)
            this.calcKeepPoint(val)
            this.handleInputValue()
        },
        backgroundCalc() {
            const pressTime = +new Date() - this.pressTime
            //變速
            //按壓 2秒後全速
            //按壓 1秒後加快速度
            const timerMaxCount = pressTime > 1750
                ? 1
                : pressTime > 750
                    ? 3
                    : 6
            this.timerCount = ++this.timerCount % timerMaxCount
            if (this.isPress && this.timerCount === 0) {
                this.calcKeepPoint(+(this.isPress).toFixed(1))
                this.handleInputValue()
            }
            this.timer = requestAFrame(this.backgroundCalc)
        },
        calcKeepPoint(val) {
            let calc = +(this.keepPoint + val).toFixed(1)
            calc = Math.max(Math.min(this.floatPrize.keepPoint * 100, calc), 0).toFixed(1)
            if (calc !== this.keepPoint) {
                this[_M.SET_KEEP_POINT](calc)
                this.$root.$emit('updateBonus')
            }
        },
        handleClick(e) {
            e.preventDefault()
            const x = e.clientX || e.touches[0].clientX
            const val = ~~Math.max(Math.min(x - this.trackX, this.trackWidth), 0)
            this[_M.SET_KEEP_POINT](this.percentMap[val])
            this.isClick = true
            this.handleInputValue()
            if (this.isMobile) {
                document.addEventListener('touchmove', this.handleTouchMove, false)
            } else {
                document.addEventListener('mousemove', this.handleMouseMove, false)
            }
        },
        handleClickOut() {
            clearTimeout(this.pressTimer)
            this.isClick = false
            this.isPress = false
            document.removeEventListener('touchmove', this.handleTouchMove, false)
            document.removeEventListener('mousemove', this.handleMouseMove, false)
        },
        handleInputClick(e) {
            e.target.setSelectionRange(0, e.target.value.length)
            e.target.focus()
        },
        handleMouseMove(e) {
            e.preventDefault()
            this.isClick && this.setKeepPoint(e.clientX)
            this.handleInputValue()
        },
        handleTouchMove(e) {
            this.isClick && this.setKeepPoint(e.touches[0].clientX)
            this.handleInputValue()
        },
        setKeepPoint(x) {
            const val = ~~Math.max(Math.min(x - this.trackX, this.trackWidth), 0)
            this[_M.SET_KEEP_POINT](this.percentMap[val])
            this.$root.$emit('updateBonus')
        },
        handleInputValue() {
            this.$root.$emit('onInputValue', (this.kp - this.keepPoint).toFixed(1))
            this.$root.$emit('updateBonus')
        },
        setInputValue(e) {
            let inputValue = e.target.value
            this.$root.$emit('onInputValue', inputValue)
            this[_M.SET_KEEP_POINT](this.kp - inputValue)
            this.$nextTick(() => this.$root.$emit('updateBonus'))
        },
        onInputValue(v) {
            this.inputValue = v
        },
        formatNumber() {
            return formatNumber(...arguments)
        },
        applyAutoOdds(hprize) {
            return (hprize + this.adjustedAutoOdds).toFixed(5)
        }
    },
    computed: {
        ...mapGetters([
            'keepPoint',
            'floatPrize',
            'RWDMode',
            'isMobile',
            'diffPrizeData',
            'methodId',
            'gameConfigData',
            'gameLotteryId',
            'gameIndex',
            'gameOrder',
            'moneyRatio',
            'lang'
        ]),
        width() {
            return this.pointMap[this.keepPoint.toFixed(1)] + '%'
        },
        kp() {
            return this.floatPrize.keepPoint * 100
        },
        prizeIsUpdated() {
            const { methodId, typeName } = this.gameOrder
            return this.diffPrizeData[typeName + methodId]
        },
        adjustedAutoOdds() {
            return this.autoOdds * this.moneyRatio
        },
        splitHprize() {
            return this.hprize.split(' | ')
        }
    },
    directives: {
        inputValue: {
            update(el, binding, vnode) {
                const _this = vnode.context
                let value = binding.value
                _this.$nextTick(() => {
                    if (value === '' || +value < 0) {
                        _this[_M.SET_KEEP_POINT](_this.kp)
                    } else if (isNaN(+value)) {
                        const filter = value.replace(/[^0-9.]/g, '')
                        if (filter.split('').filter(t => t === '.').length > 1) {
                            _this.$root.$emit('onInputValue', '0.0')
                            _this[_M.SET_KEEP_POINT](_this.kp)
                        } else {
                            _this.$root.$emit('onInputValue', filter)
                            _this[_M.SET_KEEP_POINT](_this.kp - filter)
                        }
                    } else if (value.indexOf('.') === 0 && value.length > 1) {
                        _this[_M.SET_KEEP_POINT]((_this.kp - +value).toFixed(1))
                    } else if (+value > _this.kp) {
                        _this[_M.SET_KEEP_POINT](0)
                    }
                })
            }
        }
    }
}
</script>
