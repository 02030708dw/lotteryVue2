<component
    :is="VN_gameType"
    :showGameBox="showGameBox"
/>
<script>
    import currentVNGame from '@C/games/components/VN/currentVNGame'
    import Old from './Old'
    import Input from './Input'
    import Quick from './Quick'
    import Balls from './Balls'
    export default {
        name: 'GameStatistics',
        extends: currentVNGame,
        components: {
            Old,
            Input,
            Quick,
            Balls
        }
    }
</script>
