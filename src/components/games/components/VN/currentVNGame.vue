
<template>
    <component :is="VN_gameType" />
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'currentVNGame',
        computed: {
            ...mapGetters([
                'VN_gameType'
            ])
        }
    }
</script>
