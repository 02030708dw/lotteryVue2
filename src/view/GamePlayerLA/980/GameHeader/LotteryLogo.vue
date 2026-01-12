<template>
    <div class="gr_games-la-header__logo" :class="[logoClass]" />
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'LotteryLogo',
        computed: {
            ...mapGetters([
                'LA_gameType',
                'LA_lotteryId'
            ]),
            logoClass() {
                return `lottery_${this.LA_lotteryId}`
            }
        }
    }
</script>