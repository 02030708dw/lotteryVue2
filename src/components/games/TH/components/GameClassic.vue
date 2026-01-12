<template>
     <div class="gr_game-th-classic">
            <div class="gr_classic-tab">
                <div
                    class="gr_classic-tab--item"
                    v-for="(item, index) in 10"
                >
                    {{plusZero(index, 3)}}
                    <span>12</span>
                </div>
            </div>
            <div class="gr_classic-container">
                <div
                    class="gr_classic-num--item"
                    v-for="(item, index) in 100"
                    :class="{is_active: index === 0}"
                >
                    {{plusZero(index, 3)}}
                </div>
            </div>
        </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { warnMessageBox, formatNumber } from '@UTIL'

    export default {
        name: 'GameBalls',
        methods: {
            plusZero(num, size) {
                num = String(num)
                let length = num.length
                if (num.length < size) {
                    for (let i = 0; i < size - length; i++) {
                        num = '0' + num
                    }
                }
                return num
            }
        }
    }
</script>
