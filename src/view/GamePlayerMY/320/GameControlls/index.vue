<template>
    <component
        :is="MY_gameType"
        :handleGameBox="handleGameBox"
        :showGameBox="showGameBox"
    />
</template>
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
        },
        props: {
            handleGameBox: Function,
            showGameBox: Boolean
        }
    }
</script>
