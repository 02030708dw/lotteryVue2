<template>
    <component
        :is="MY_gameType"
        :showGameBox="showGameBox"
    />
</template>
<script>
    import currentMYGame from '@C/games/components/MY/currentMYGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameStatistics',
        extends: currentMYGame,
        data() {
            return {
                showGameBox: false
            }
        },
        components: {
            Old,
            Input
        }
    }
</script>
