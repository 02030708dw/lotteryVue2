<script>
import PageNation from '@C/PageNation'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'PageNation',
    mixins: [PageNation],
    methods: {
        ...mapActions([
            _M.GET_WALLET_LIST,
            _M.SET_WALLET_INFO_PAGE_NATION_NUM
        ]),
        search(page) {
            if (page === this.page) {
                return
            }
            this.$root.$emit('checkOrderTypes')
            this[_M.GET_WALLET_LIST]({page})
        },
        setPageNationNum(page) {
            if (page === this.getWalletInfoPageNationNum) {
                return
            }
            this[_M.SET_WALLET_INFO_PAGE_NATION_NUM](page)
        }
    },
    computed: {
        ...mapGetters([
            'getWalletList',
            'getWalletInfoPageNationNum'
        ]),
        infoList() {
            return this.getWalletList
        },
        pageNationNum() {
            return this.getWalletInfoPageNationNum
        }
    }
}
</script>
