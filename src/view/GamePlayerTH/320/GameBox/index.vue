<template>
    <component
        :is="TH_gameType"
        :isFast="isFast"
    />
</template>
<script>
    import currentTHGame from '@C/games/components/TH/currentTHGame'
    import Old from './Old'
    import Input from './Input'
    export default {
        name: 'GameBoxTH320',
        extends: currentTHGame,
        components: {
            Old,
            Input
        },
        props: {
            isFast: Boolean
        }
    }
</script>
