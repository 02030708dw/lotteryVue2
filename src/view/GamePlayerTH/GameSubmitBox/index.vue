<template>
    <component :is="TH_gameType" :zIndex="1998" />
</template>
<script>
    import currentTHGame from '@C/games/components/TH/currentTHGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameSubmitBoxTH',
        extends: currentTHGame,
        components: {
            Old,
            Input
        }
    }
</script>
