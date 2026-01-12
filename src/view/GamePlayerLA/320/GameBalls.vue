<template>
     <div v-show="!gameMenuActive">
        <GameBox v-show="false" /> <!--點'直接投注'、'查看投注项'會顯示-->
        <div class="gr_game-gameGroup">
            <GameStatistics />
            <GameControlls />
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
.gr_game-gameGroup {
    width: 100%;
    display: block;
    position: fixed;
    bottom: 0px;
    left: 0px;
    z-index: 50;
}
</style>
<script>
import GameBox from './GameBox'
import GameStatistics from './GameStatistics'
import GameControlls from './GameControlls'
import { mapGetters, mapActions } from 'vuex'
import { warnMessageBox } from '@UTIL'
export default {
    name: 'GameOFFICIAL',
    data() {
        return {
            gameShowMode: 0,
            gameMenuActive: false
        }
    },
    components: {
        GameBox,
        GameStatistics,
        GameControlls
    },
    methods: {
        ...mapActions([
            _M.SET_GAME_ORDER_TIMES
        ])
    }
}
</script>
