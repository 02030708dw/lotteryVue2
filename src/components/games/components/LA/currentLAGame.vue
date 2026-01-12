
<template>
    <component :is="LA_gameType" />
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'currentLAGame',
        computed: {
            ...mapGetters([
                'LA_gameType'
            ])
        }
    }
</script>
