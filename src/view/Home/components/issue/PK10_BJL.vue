<template>
    <div class="gr_lottery__opencode">
        <i18n path="common_001" tag="span" v-if="issueInfo.issue">
            <strong place="0">{{issueInfo.issue}}</strong>
        </i18n>
        <div class="balls-container" :class="menu.function_type">
            <div class="card" :class="`c${calcCards[0]}`" />
            <div class="vs">VS</div>
            <div class="card" :class="`c${calcCards[1]}`" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.balls-container {
    text-align: center;
    .vs {
        position: relative;
        display: inline-block;
        text-align: center;
        width: 51px;
        height: 38px;
        transform: translateY(-16px);
        font-size: 32px;
        font-weight: bold;
        color: #fff6b9;
        -webkit-text-stroke: 2px #603813;
    }
    .card {
        margin: 5px 5px 0 0;
        background-image: url('/static/image/game/BJL/cards.png');
        position: relative;
        display: inline-block;
        text-align: center;
        box-shadow: 1px 1px 10px #646464;
        transform: scale(.9);
    }
    @for $i from 1 through 26 {
        $val: ($i - 1) * -46;
        .c#{$i} {
            width: 44px;
            height: 61px;
            background-position: ($val - 1px) -1px;
        }
        .c#{$i + 26} {
            width: 44px;
            height: 61px;
            background-position: ($val - 1px) -64px;
        }
    }

}

</style>
<script>
import Mixin from './Mixin'
export default {
    name: 'PK10_BJL',
    extends: Mixin,
    methods: {
        // 庄家
        calcBookmaker(code) {
            const first = (+code[4] + +code[5]) % 10
            const second = (+code[6] + +code[7]) % 10
            const third = +code[9]
            const sum = (first + second) % 10
            // 闲家 前兩張牌
            const pyfirst = (+code[0] + +code[1]) % 10
            const pysecond = (+code[2] + +code[3]) % 10
            const pythird = this.calcPlayer2(code)
            const pysum = (pyfirst + pysecond) % 10
            // 闲家首兩張牌合計點數为8-9点。
            // 庄家首兩張牌合計點數为7-9点。
            if (pysum > 7 || sum > 6) {
                return sum
            // 若闲家为6、7点时，庄家补牌。
            // 若闲家为1、2、3点时补一张牌，除非闲家为8或9点。
            } else if ([6, 7].includes(pysum) || [0, 1, 2].includes(sum)) {
                return sum + third
            } else {
                switch (sum) {
                    // 若闲家补得第三张牌为8点，庄家不须补。
                    // 若闲家补得第三张牌非8点，庄家补牌。
                    case 3:
                        return pythird !== 8 ? sum + third : sum
                    case 4:
                        return [2, 3, 4, 5, 6, 7].includes(pythird) ? sum + third : sum
                    case 5:
                        return [4, 5, 6, 7].includes(pythird) ? sum + third : sum
                    case 6:
                        return [6, 7].includes(pythird) ? sum + third : sum
                    default:
                        return sum
                }
            }
        },
        // 闲家
        calcPlayer(code) {
            const first = (+code[0] + +code[1]) % 10
            const second = (+code[2] + +code[3]) % 10
            const third = +code[8]
            const sum = (first + second) % 10
            // 庄家 前兩張牌
            const bkfirst = (+code[4] + +code[5]) % 10
            const bksecond = (+code[6] + +code[7]) % 10
            const bksum = (bkfirst + bksecond) % 10
            return (bksum > 7 || sum > 5) ? sum : sum + third
        },
        // 闲家補牌
        calcPlayer2(code) {
            const first = (+code[0] + +code[1]) % 10
            const second = (+code[2] + +code[3]) % 10
            const third = +code[8]
            const sum = (first + second) % 10
            // 庄家 前兩張牌
            const bkfirst = (+code[4] + +code[5]) % 10
            const bksecond = (+code[6] + +code[7]) % 10
            const bksum = (bkfirst + bksecond) % 10
            return (bksum > 7 || sum > 5) ? 0 : third
        }
    },
    computed: {
        calcCards() {
            const balls = this.splitCode
            const lastNumber = +((this.issueInfo.issue || '-').split('-')[1] || 0)
            const cardNums = [
                (+balls[0] + +balls[1]) % 10,
                (+balls[2] + +balls[3]) % 10,
                +balls[8],
                (+balls[4] + +balls[5]) % 10,
                (+balls[6] + +balls[7]) % 10,
                +balls[9]
            ]
            if (this.calcPlayer(balls) === ((cardNums[0] + cardNums[1]) % 10)) {
                cardNums[2] = 0
            }
            if (this.calcBookmaker(balls) === ((cardNums[3] + cardNums[4]) % 10)) {
                cardNums[5] = 0
            }
            // 花色規則
            const front = (cardNums[0] + cardNums[1] + cardNums[2]) % 10
            const back = (cardNums[3] + cardNums[4] + cardNums[5]) % 10
            return [
                (((front + lastNumber) % 4) * 13 + front) || 10,
                (((back + lastNumber) % 4) * 13 + back) || 10
            ]
        }
    }
}
</script>