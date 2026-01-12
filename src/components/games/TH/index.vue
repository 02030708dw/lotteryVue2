<script>
    import TH from './main'
    import currentGame from '@C/games/components/TH/currentGame'
    export default {
        name: 'TH',
        extends: currentGame,
        created() {
        // !this.gameConfig[this.fullTypeName] && this[_M.SET_GAME_CONFIG](config)
    },
        components: {
            ...TH
        }
    }
</script>