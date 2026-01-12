<template>
    <component :is="currentRWD"/>
</template>

<script>
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import PlayInfo from '@C/../store/modules/PlayInfo/'

import { mapActions } from 'vuex'

export default {
    name: 'playInfo',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320
    },
    methods: {
        ...mapActions([
            _M.GET_PLAYINFO_LIST
        ])
    },
    created() {
        //lazy load store
        this.setStore({ PlayInfo })
        this[_M.GET_PLAYINFO_LIST]()
    },
    props: {
        setStore: Function
    }
}
</script>
