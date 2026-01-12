<template>
    <component
        :is="currentGame"
    />
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'currentGame',
        computed: {
            ...mapGetters([
                // 'fullTypeName'
            ])
        },
        props: {
            currentGame: String
        }
    }
</script>
