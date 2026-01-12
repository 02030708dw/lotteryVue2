<template>
    <div class="c_button__text">
        <span>
            <!-- {{$t("截止时间")}} -->
            {{$t('common_077')}}
        </span>
        <span>{{localTimer}}</span>
    </div>
</template>
<style lang="scss" scoped>
    span + span {
        padding: 0 0 0 15px;
    }
    div {
        display: inline-block;
        vertical-align: middle;
        span {
            display: block;
            line-height: 14px;
        }
    }
</style>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'coldTimerButton',
    methods: {
        localTranstime(data) {
            return (data || {}).isCountDown ? `${data.minutes}:${data.seconds}` : '00:00'
        }
    },
    computed: {
        ...mapGetters([
            'VN_flipTimer',
            'VN_localArea'
        ]),
        flipTimer() {
            return this.VN_flipTimer[this.area] || {}
        },
        localTimer() {
            return this.localTranstime(this.VN_flipTimer[this.VN_localArea])
        }
    }
}
</script>