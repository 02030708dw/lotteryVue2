<script>
    import stock from './main'
    import currentGame from './components/currentGame'
    import config from './configs'
    export default {
        name: 'STOCK',
        extends: currentGame,
        created() {
            !this.gameConfig[this.fullTypeName] && this[_M.SET_GAME_CONFIG](config)
        },
        components: {
            ...stock
        }
    }
</script>