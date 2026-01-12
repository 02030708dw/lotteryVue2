<template>
    <component
        :is="VN_gameType"
        :handleGameBox="handleGameBox"
        :showGameBox="showGameBox"
        :setIsFast="setIsFast"
        :isFast="isFast"
    />
</template>
<script>
    import currentVNGame from '@C/games/components/VN/currentVNGame'
    import Old from './Old'
    import Input from './Input'
    import Quick from './Quick'
    import Balls from './Balls'
    export default {
        name: 'GameControlls',
        extends: currentVNGame,
        components: {
            Old,
            Input,
            Quick,
            Balls
        },
        props: {
            handleGameBox: Function,
            showGameBox: Boolean,
            setIsFast: Function,
            isFast: Boolean
        }
    }
</script>
