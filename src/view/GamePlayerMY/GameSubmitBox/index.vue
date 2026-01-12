<template>
    <component :is="MY_gameType" :zIndex="1998" />
</template>
<script>
    import currentMYGame from '@C/games/components/MY/currentMYGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameSubmitBoxMY',
        extends: currentMYGame,
        components: {
            Old,
            Input
        }
    }
</script>
