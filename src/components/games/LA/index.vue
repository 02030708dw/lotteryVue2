<script>
    import LA from './main'
    import currentGame from '@C/games/components/LA/currentGame'
    export default {
        name: 'LA',
        extends: currentGame,
        created() {
        },
        components: {
            ...LA
        }
    }
</script>