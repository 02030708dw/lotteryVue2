<script>
    import K3_SIN from './main'
    import currentGame from '@C/games/components/SIN/currentGame'
    export default {
        name: 'K3_SIN',
        extends: currentGame,
        components: {
            ...K3_SIN
        }
    }
</script>