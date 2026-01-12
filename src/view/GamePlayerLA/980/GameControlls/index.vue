<script>
    import currentLAGame from '@C/games/components/LA/currentLAGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameControlls',
        extends: currentLAGame,
        components: {
            Old,
            Input
        }
    }
</script>
