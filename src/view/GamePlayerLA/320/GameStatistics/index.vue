<template>
    <component
        :is="LA_gameType"
        :showGameBox="showGameBox"
    />
</template>
<script>
    import currentLAGame from '@C/games/components/LA/currentLAGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameStatistics',
        extends: currentLAGame,
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
