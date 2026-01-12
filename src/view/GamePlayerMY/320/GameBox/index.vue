<template>
    <component
        :is="MY_gameType"
        :isFast="isFast"
    />
</template>
<script>
    import currentMYGame from '@C/games/components/MY/currentMYGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameBoxMY320',
        extends: currentMYGame,
        components: {
            Old,
            Input
        },
        props: {
            isFast: Boolean
        }
    }
</script>
