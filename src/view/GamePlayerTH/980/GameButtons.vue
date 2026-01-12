<template>
    <div class="gr_game-vn-button-group">
        <button
            @click="reset"
            class="c_button--default  c_button--large"
        >
            <span class="c_button__text">
                <!-- '重置' -->
                {{$t('common_062')}}
            </span>
        </button>
        <button
            @click="submit"
            class="c_button--large c_button--primary"
        >
            <!-- '投注' -->
            <span class="c_button__text">{{$t('vn_t_017')}}</span>
        </button>
    </div>
</template>
<script>

import { mapGetters } from 'vuex'
// import { formatNumber, warnMessageBox } from '@UTIL'
export default {
    name: 'GameButtons',
    methods: {
        submit() {
            this.$root.$emit('beforeCheck', {})
        },
        reset() {
            this.$root.$emit('reset')
        }
    },
    computed: {
        ...mapGetters([
            'isShowDemo',
            'isDev'
        ]),
        ...mapGetters({
        })
    }
}
</script>
