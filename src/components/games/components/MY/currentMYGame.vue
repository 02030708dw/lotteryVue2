
<template>
    <component :is="MY_gameType" />
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'currentMYGame',
        computed: {
            ...mapGetters([
                'MY_gameType'
            ])
        }
    }
</script>
