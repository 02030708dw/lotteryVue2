
<template>
    <component :is="TH_gameType" />
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'currentTHGame',
        computed: {
            ...mapGetters([
                'TH_gameType'
            ])
        }
    }
</script>
