<template>
    <component
        :is="LA_gameType"
        :isFast="isFast"
    />
</template>
<script>
    import currentLAGame from '@C/games/components/LA/currentLAGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameBoxLA320',
        extends: currentLAGame,
        components: {
            Old,
            Input
        },
        props: {
            isFast: Boolean
        }
    }
</script>
