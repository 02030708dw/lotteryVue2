<template>
    <component :is="currentRWD"/>
</template>

<script>
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'ScoreBoard',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    watch: {
        RWDMode() {
            this.RWDMode !== 3 && this.$router.replace('/')
        }
    },
    computed: {
        ...mapGetters([
            'RWDMode'
        ])
    },
    methods: {
        ...mapActions([
            _M.GET_STRING_POOL
        ])
    }
}
</script>
