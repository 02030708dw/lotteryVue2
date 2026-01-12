<template>
    <component
        :is="LA_gameType"
        :handleGameBox="handleGameBox"
        :showGameBox="showGameBox"
    />
</template>
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
        },
        props: {
            handleGameBox: Function,
            showGameBox: Boolean
        }
    }
</script>
