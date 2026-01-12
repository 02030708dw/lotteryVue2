<template>
    <RWD320 v-if="isShow"/>
</template>

<script>
import RWD320 from './320/'
import { mapGetters } from 'vuex'

export default {
    name: 'SalesTime',
    components: {
        RWD320
    },
    computed: {
        ...mapGetters([
            'RWDMode'
        ]),
        isShow() {
            switch (this.RWDMode) {
                case 3:
                    return true
                case 1:
                default:
                    this.$router.push('/')
                    return false
            }
        }
    }
}
</script>
