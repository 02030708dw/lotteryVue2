<template>
  <component :is="currentRWD" />
</template>
<script>
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import Wallet from '../../store/modules/Wallet'
import { mapActions } from 'vuex'

export default {
    name: 'wallet',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                // pageList: ['Desktop', 'Wallet', 'tools/lottery'],
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    created() {
        this.setStore({ Wallet })
    },
    beforeDestroy() {
        this.clearWalletList()
    },
    methods: {
        ...mapActions([
            _M.GET_WALLET_LIST,
            _M.GET_STRING_POOL,
            'clearWalletList'
        ])
    },
    props: {
        setStore: Function
    }
}
</script>
