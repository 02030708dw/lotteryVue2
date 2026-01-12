<template>
    <div class="gr_game-vn-controller  gr_container  u_clearfix  bg_primary">
        <div class="gr_game-controller__inner">
            <div v-if="VN_subMenuIndex !== 2" class="c_input--shortest">
                <input
                    class="c_input__inner"
                    type="text"
                    :value="insValue"
                    @input="setInsValue($event.target.value)"
                    @keydown.enter="insRow"
                />
            </div>
            <button
                v-if="VN_subMenuIndex !== 2"
                class="c_button--secondary"
                @click="insRow"
            >
                <span class="c_button__text">
                    <!-- '添加'-->
                    {{$t('common_146')}}
                </span>
            </button>
            <div class="gr_game-controller__row">
                <GameButtons />
            </div>
        </div>
    </div>
</template>
<script>

import { mapGetters, mapActions } from 'vuex'
import GameButtons from '../GameButtons'
// import { formatNumber, warnMessageBox } from '@UTIL'
export default {
    name: 'GameControlls',
    components: {
        GameButtons
    },
    data() {
        return {
            insValue: 1
        }
    },
    methods: {
        ...mapActions([
        ]),
        setInsValue(val) {
            this.insValue = val
            this.$nextTick(() => {
                const v = this.insValue
                if (isNaN(v) || /[.+-]/g.test(v)) {
                    this.insValue = v.replace(/[\D.+-]/g, '')
                }
            })
        },
        insRow() {
            this.$root.$emit('insRow', +this.insValue)
        }
    },
    computed: {
        ...mapGetters([
            'isShowDemo',
            'isDev',
            'VN_subMenuIndex'
        ]),
        ...mapGetters({
            lotteryId: 'gameLotteryId'
        })
    }
}
</script>
