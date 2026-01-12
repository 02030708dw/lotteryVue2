<script>
    import VN from './main'
    import currentGame from '@C/games/components/VN/currentGame'
    export default {
        name: 'VN',
        extends: currentGame,
        created() {
            // !this.gameConfig[this.fullTypeName] && this[_M.SET_GAME_CONFIG](config)
        },
        components: {
            ...VN
        }
    }
</script>