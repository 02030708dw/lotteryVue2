<template>
    <component
        :is="TH_gameType"
        :showGameBox="showGameBox"
    />
</template>
<script>
    import currentTHGame from '@C/games/components/TH/currentTHGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameStatistics',
        extends: currentTHGame,
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
