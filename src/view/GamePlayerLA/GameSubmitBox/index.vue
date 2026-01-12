<template>
    <component :is="LA_gameType" :zIndex="1998" />
</template>
<script>
    import currentLAGame from '@C/games/components/LA/currentLAGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameSubmitBoxLA',
        extends: currentLAGame,
        components: {
            Old,
            Input
        }
    }
</script>
