<template>
    <div class="gr_games-header__logo" :class="logoClass" />
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
div {
    @include size(110px, 95px);
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;
    &::before {
        @include pseudo;
        @include size(100%, 12px);
        background: radial-gradient(ellipse at center, rgba($color_default, 0.3) 0%, rgba($color_default, 0.1) 25%, rgba(255, 255, 255, 0) 40%);
        bottom: -6px;
        left: 5%;
    }
}

@media screen and (max-width: 979px) {
    div {
        @include size(100px, 95px);
    }
}
</style>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'LotteryLogo',
        computed: {
            ...mapGetters([
                'gameType',
                'gameLotteryId'
            ]),
            logoClass() {
                return `lottery_${this.gameLotteryId} ${(this.gameType || '').toLocaleLowerCase()}`
            }
        }
    }
</script>