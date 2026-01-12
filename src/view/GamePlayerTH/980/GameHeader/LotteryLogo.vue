<template>
    <div class="gr_games-th-header__logo" :class="[{pure: isW88}, logoClass]" />
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'LotteryLogo',
        computed: {
            ...mapGetters([
                'isW88',
                'TH_gameType',
                'TH_lotteryId'
            ]),
            logoClass() {
                return `lottery_${this.TH_lotteryId}`
            }
        }
    }
</script>