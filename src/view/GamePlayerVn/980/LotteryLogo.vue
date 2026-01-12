<template>
    <div class="gr_games-vn-header__logo" :class="[{pure: isW88}, logoClass]" />
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'LotteryLogo',
        computed: {
            ...mapGetters([
                'isW88',
                'VN_isLocal'
            ]),
            logoClass() {
                return `lottery_${this.VN_isLocal}`
            }
        }
    }
</script>