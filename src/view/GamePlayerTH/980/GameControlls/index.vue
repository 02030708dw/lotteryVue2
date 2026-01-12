<script>
    import currentTHGame from '@C/games/components/TH/currentTHGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameControlls',
        extends: currentTHGame,
        components: {
            Old,
            Input
        }
    }
</script>
