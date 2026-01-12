<template>
    <div class="gr_lottery__opencode">
        <i18n path="common_001" tag="span" v-if="issueInfo.issue">
            <strong place="0">{{issueInfo.issue}}</strong>
        </i18n>
        <div class="balls-container">
            <div class="animals" :class="animalKey[balls]" v-for="(balls, j) in splitCode" :key="j" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.balls-container {
    text-align: center;
    .animals {
        margin: 10px 5px 0 0;
        background-image: url('/static/image/game/K3_YXX/animals.png');
        position: relative;
        display: inline-block;
        text-align: center;
    }
    .fish {
        width: 59px;
        height: 54px;
        background-position: -123px -1px;
    }
    .shrimp {
        width: 59px;
        height: 54px;
        background-position: -245px -1px;
    }
    .gourd {
        width: 59px;
        height: 54px;
        background-position: -184px -1px;
    }
    .tiger {
        width: 59px;
        height: 54px;
        background-position: -306px -1px;
    }
    .crab {
        width: 59px;
        height: 54px;
        background-position: -62px -1px;
    }
    .chicken {
        width: 59px;
        height: 54px;
        background-position: -1px -1px;
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