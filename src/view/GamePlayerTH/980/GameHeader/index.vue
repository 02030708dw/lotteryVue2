<template>
    <component :is="currentComponent" />
</template>
<script>
    import { mapGetters } from 'vuex'
    import GamesHeaderNormal from './GamesHeaderNormal'
    import GamesHeaderVideo from './GamesHeaderVideo'
    import iframeGameSource from '@UTIL/games/iframeGameSource'
    export default {
        name: 'GameHeader',
        components: {
            GamesHeaderNormal,
            GamesHeaderVideo
        },
        computed: {
            ...mapGetters([
                'TH_gameType',
                'TH_lotteryId'
            ]),
            currentComponent() {
                const currentLottery = !iframeGameSource[this.TH_lotteryId]
                return currentLottery ? 'GamesHeaderNormal' : 'GamesHeaderVideo'
            }
        }
    }
</script>
