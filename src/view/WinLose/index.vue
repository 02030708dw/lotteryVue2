<template>
    <component :is="currentRWD" />
</template>

<script>
import RWD_980 from './980/'
import RWD_320 from './320/'
import RwdMixin from '@C/RwdMixin'
import WinLose from '@C/../store/modules/WinLose/'

import { mapActions } from 'vuex'

export default {
    name: 'WinLose',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                // pageList: ['Desktop', 'GamePlayer', 'GameInfo', 'Message', 'tools/lottery'],
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    methods: {
        ...mapActions([
            _M.USERPROFIT_LIST,
            _M.GET_STRING_POOL
        ])
    },
    destroyed() {
        this[_M.USERPROFIT_LIST]()
    },
    created() {
        //lazy load store
        this.setStore({ WinLose })
    },
    props: {
        setStore: Function
    }
}
</script>
