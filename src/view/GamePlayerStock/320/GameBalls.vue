<template>
    <div v-show="!gameMenuActive">
        <div v-show="gameShowMode === 0">
            <GamePrompt/>
            <div class="u_hr--thin  u_m--r10  u_m--l10" />
            <GameOptions/>
            <component :is="gameType" />
        </div>
        <GameBox v-show="gameShowMode === 2" />
        <div class="gr_game-gameGroup">
            <GameStatistics :isBlocked="isBlocked"/>
            <GameControlls :isBlocked="isBlocked"/>
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
import GamePrompt from './GamePrompt'
import GameOptions from './GameOptions'
import { mapGetters, mapActions } from 'vuex'
import { warnMessageBox } from '@UTIL'
export default {
    name: 'GameBall320',
    components: {
        STOCK: r => require.ensure([], () => r(require('@C/games/STOCK')), 'STOCK'),
        GameBox,
        GameStatistics,
        GameControlls,
        GamePrompt,
        GameOptions
    },
    beforeMount() {
        // 變更彩種後, 重置onePrice
        this[_M.SET_GAME_ORDER_DATA]({ onePrice: 1 })
    },
    subscriptions() {
        return {
            methodId$: this.$watchAsObservable('methodId')
                .startWith('1')
                .do(() => {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            if (this.isBlocked === true) {
                                this.$msg(warnMessageBox({
                                // 此玩法本期已停售。
                                    message: 'popup_087',
                                    type: 'warning',
                                    content: ''
                                }))
                            }
                        }, 500)
                    })
                })
        }
    },
    computed: {
        ...mapGetters([
            'gameType',
            'gameMenuActive',
            'gameShowMode',
            'blockedMethods',
            'methodId',
            'gameTimes'
        ]),
        isBlocked() {
            return this.blockedMethods[this.methodId]
        }
    },
    methods: {
        ...mapActions([
            _M.SET_GAME_ORDER_DATA
        ])
    }
}
</script>
