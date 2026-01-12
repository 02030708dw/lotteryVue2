<template>
    <component :is="currentRWD" />
</template>

<script>
import RWD_980 from './980/'
import RWD_320 from './320/'
import RwdMixin from '@C/RwdMixin'
import ReportList from '@C/../store/modules/ReportList/'

import { mapActions } from 'vuex'

export default {
    name: 'ReportList',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                // pageList: ['Desktop', 'GameInfo', 'Message', 'tools/lottery'],
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    methods: {
        ...mapActions([
            _M.CLEAR_REPORT_DATA,
            _M.GET_STRING_POOL
        ])
    },
    destroyed() {
        this[_M.CLEAR_REPORT_DATA]()
    },
    created() {
        //lazy load store
        this.setStore({ ReportList })
    },
    props: {
        setStore: Function
    }
}
</script>
