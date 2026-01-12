<script>
    import MY from './main'
    import currentGame from '@C/games/components/MY/currentGame'
    export default {
        name: 'MY',
        extends: currentGame,
        created() {
        },
        components: {
            ...MY
        }
    }
</script>