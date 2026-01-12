<template>
    <component
        :is="TH_gameType"
        :handleGameBox="handleGameBox"
        :showGameBox="showGameBox"
    />
</template>
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
        },
        props: {
            handleGameBox: Function,
            showGameBox: Boolean
        }
    }
</script>
