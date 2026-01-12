<template>
    <div>
        <GameSubMenu />
        <GamePrompt />
        <component :is="gameType" />
        <GameOptions />
        <GameControlls :isBlocked="isBlocked" />
        <GameBox :isBlocked="isBlocked" />
    </div>
</template>

<script>
import GameSubMenu from './GameSubMenu'
import GamePrompt from './GamePrompt'
import GameControlls from './GameControlls'
import GameBox from './GameBox'
import GameOptions from './GameOptions'

import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'GameBalls980',
    components: {
        GameSubMenu,
        GamePrompt,
        GameControlls,
        GameBox,
        GameOptions,
        STOCK: r => require.ensure([], () => r(require('@C/games/STOCK')), 'STOCK')
    },
    beforeMount() {
        // 變更彩種後, 重置onePrice
        this[_M.SET_GAME_ORDER_DATA]({ onePrice: 1 })
    },
    watch: {
        fullTypeName() {
            // 還原預設值
            this[_M.SET_TAB_INDEX]({})
        }
    },
    methods: {
        ...mapActions([
            _M.SET_TAB_INDEX,
            _M.SET_GAME_ORDER_DATA
        ])
    },
    computed: {
        ...mapGetters([
            'gameType',
            'gameSubmit',
            'fullTypeName',
            'blockedMethods',
            'methodId',
            'getGameOption'
        ]),
        onePrice() {
            return this.gameSubmit.onePrice
        },
        isBlocked() {
            return this.blockedMethods[this.methodId]
        }
    }
}
</script>
