<script>
    import currentMYGame from '@C/games/components/MY/currentMYGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameControlls',
        extends: currentMYGame,
        components: {
            Old,
            Input
        }
    }
</script>
