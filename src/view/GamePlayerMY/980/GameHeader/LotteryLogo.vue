<template>
    <div class="gr_games-my-header__logo" :class="[logoClass]" />
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'LotteryLogo',
        computed: {
            ...mapGetters([
                'MY_gameType',
                'MY_lotteryId'
            ]),
            logoClass() {
                return `lottery_${this.MY_lotteryId}`
            }
        }
    }
</script>