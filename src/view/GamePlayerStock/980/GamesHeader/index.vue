<template>
    <component
        :is="currentComponent"
    />
</template>
<script>
import GamesHeaderNormal from './GamesHeaderNormal'
import GamesHeader2Timer from './GamesHeader2Timer'
import { mapGetters } from 'vuex'
export default {
    name: 'GamesHeader',
    components: {
        GamesHeaderNormal,
        GamesHeader2Timer
    },
    computed: {
        ...mapGetters([
            'gameLotteryId',
            'get2Timer'
        ]),
        currentComponent() {
            // 一日兩期
            const is2Timer = this.get2Timer.includes(+this.gameLotteryId)
            return is2Timer ? 'GamesHeader2Timer' : 'GamesHeaderNormal'
        }
    }
}
</script>