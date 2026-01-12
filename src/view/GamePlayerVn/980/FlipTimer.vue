<template>
    <div class="flip-clock-wrapper">
        <div
            class="u_f--left"
            :class="{hours: !i, minutes: i === 1, seconds: i === 2}"
            v-for="(a, i) in 3"
        >
            <ul
                class="flip"
                :class="{ play: !isFlipTimerload[j + i * 2] || (isCountDown && +getDigit[i][j] !== 0) }"
                v-for="(arr, j) in getDigitArr(utils[i])"
                v-if="i || j || (!i && !+VN_isLocal)"
            >
                <li v-for="item in arr" :class="digit(+getDigit[i][j], item, digitMax[j], j + i * 2)">
                    <a href="javascript: void(0)">
                        <div class="up">
                            <div class="shadow"></div>
                            <div class="inn">{{item}}</div>
                        </div>
                        <div class="down">
                            <div class="shadow"></div>
                            <div class="inn">{{item}}</div>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
.flip-clock-wrapper {
    display: inline-block;
    margin-top: 6px;
    height: 50px;
    & .days,
    & .hours,
    & .minutes {
        margin-right: 4px;
    }
    & .seconds {
        margin-right: 0;
        & .flip:last-child {
            margin-right: 0px;
        }
    }
    & .flip {
        box-shadow: none;
        margin: 0 4px 0 0;
        width: 34px;
        &::before,
        &::after {
            @include pseudo;
            left: 0;
            width: 100%;
        }
        &::before {
            background: #1a1a1a;
            border-top: 4px double #3E4052;
            border-bottom: 4px double #3E4052;
            bottom: -9px;
            height: 9px;
            z-index: 1;
        }
        &::after {
            border-bottom: 1.5px solid #1a1a1a;
            bottom: -10px;
            z-index: 2;
        }
    }
    & ul {
        height: 34px;
        line-height: 34px;
        li {
            line-height: 34px;
        }
    }
    & li a {
        &::before,
        &::after {
            @include background_gradient(ture, to bottom, #1a1a1a, #1a1a1a, #4d4d4d);
            @include pseudo;
            @include size(4px, 8px);
            box-shadow: none;
            top: 50%;
            transform: translateY(-50%);
            z-index: 3;
            display: none\9;
        }
        &::before {
            left: 0;
        }
        &::after {
            right: 0;
        }
        & > div {
            padding: 0 9px;
        }
        & > div.up {
            border-top: 1px solid #1A1A1A;
            border-bottom: 1.5px solid #1A1A1A;
            border-radius: 0;
            width: 100%;
            &::before {
                box-shadow: none;
            }
            & > .inn {
                @include background_gradient(ture, to bottom, #3e4052, #333333, #35353f);
            }
        }
        & > div.down {
            border-top: 1px solid #606060;
            border-bottom: 1px solid #1A1A1A;
            border-radius: 0;
            margin-top: -23px;
            width: 100%;
            &::before {
                box-shadow: none;
            }
        }
        & > div div.inn {
            font-size: 30px;
        }
    }
}


</style>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'flipTimer',
    data () {
        const number = [
            // ten
            [5, 4, 3, 2, 1, 0],
            // one
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        ]
        return {
            utils: [
                'hours',
                'minutes',
                'seconds'
            ],
            digitMax: [5, 9],
            hours: [number[1], number[1]],
            // hours: number,
            minutes: number,
            seconds: number,
            isNew: [true, true, true, true, true, true],
            isFlipTimerload: [true, true, true, true, true, true]
        }
    },
    props: {
        area: String
    },
    watch: {
        isCountDown() {
            if (!this.flipTimer.isCountDown) {
                this.reset()
            }
        }
    },
    methods: {
        ...mapActions([
            _M.GET_FLIP_TIMEER
        ]),
        digit(calc, param, digitMax, index) {
            if (calc === param) {
                return 'flip-clock-active'
            } else if (param === 0 && this.isNew[index]) {
                this.isNew[index] = false
                this.isFlipTimerload[index] = false
                return 'flip-clock-before'
            } else if (
                (param !== 0 && ((calc + 1) === param)) ||
                (param === 0 && calc === digitMax)
            ) {
                if (!this.isNew[index]) {
                    this.isFlipTimerload[index] = false
                }
                return 'flip-clock-before'
            }
        },
        getDigitArr(key) {
            return this[key]
        },
        reset() {
            this.isNew = [true, true, true, true, true, true]
        }
    },
    computed: {
        ...mapGetters([
            'VN_flipTimer',
            'VN_isLocal'
        ]),
        flipTimer() {
            return this.VN_flipTimer[this.area] || {}
        },
        getDigit() {
            return this.utils.map(util => (this.flipTimer[util] || '00').split(''))
        },
        isCountDown() {
            return this.flipTimer.isCountDown
        }
    }
}
</script>