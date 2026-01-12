<template>
    <component :is="currentRWD"/>
</template>

<script>
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import { mapGetters, mapActions } from 'vuex'
import NewsEvents from '@S/modules/NewsEvents/'

export default {
    name: 'NewsEvents',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320
    },
    watch: {
        RWDMode() {
            this.RWDMode !== 3 && this.$router.replace('/')
        }
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                // pageList: ['Desktop', 'NewsEvents', 'Message', 'tools/lottery'],
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    created() {
        //lazy load store
        this.setStore({ NewsEvents })
        this[_M.GET_NEWS_EVENTS_LIST]()

        //reset to list
        this[_M.SET_NEWS_EVENTS_DETAIL_INDEX]('')
    },
    destroyed() {
        this[_M.SET_NEWS_EVENTS_DATA]()
    },
    methods: {
        ...mapActions([
            _M.SET_NEWS_EVENTS_DATA,
            _M.GET_NEWS_EVENTS_LIST,
            _M.SET_NEWS_EVENTS_DETAIL_INDEX,
            _M.GET_STRING_POOL
        ])
    },
    props: {
        setStore: Function
    },
    computed: {
        ...mapGetters([
            'RWDMode'
        ])
    }
}
</script>
