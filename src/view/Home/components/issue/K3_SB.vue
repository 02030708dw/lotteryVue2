<template>
    <div class="gr_lottery__opencode">
        <i18n path="common_001" tag="span" v-if="issueInfo.issue">
            <strong place="0">{{issueInfo.issue}}</strong>
        </i18n>
        <div class="balls-container">
            <div class="dice" :class="`d${dice}`" v-for="(dice, j) in splitCode" :key="j" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.balls-container {
    text-align: center;
    .dice {
        margin: 10px 5px 0 0;
        background-image: url('/static/image/game/K3_SB/dice.png');
        position: relative;
        display: inline-block;
        text-align: center;
    }
    .d1 {
        width: 54px;
        height: 56px;
        background-position: -1px -119px;
    }
    .d2 {
        width: 54px;
        height: 56px;
        background-position: -1px -177px;
    }
    .d3 {
        width: 54px;
        height: 57px;
        background-position: -1px -1px;
    }
    .d4 {
        width: 54px;
        height: 57px;
        background-position: -1px -60px;
    }
    .d5 {
        width: 54px;
        height: 56px;
        background-position: -1px -235px;
    }
    .d6 {
        width: 54px;
        height: 56px;
        background-position: -1px -293px;
    }
}

</style>
<script>
import Mixin from './Mixin'
export default {
    name: 'K3_SB',
    data() {
        return {
            splitSymbol: '',
            animalKey: {
                1: 'fish',
                2: 'shrimp',
                3: 'gourd',
                4: 'tiger',
                5: 'crab',
                6: 'chicken'
            }
        }
    },
    extends: Mixin
}
</script>