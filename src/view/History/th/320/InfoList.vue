
<script>
import InfoList from '../980/InfoList'
import { mapActions } from 'vuex'

export default {
    name: 'HistoryInfoList',
    mixins: [InfoList],
    beforeMount() {
        this.$root.$on('back', this.back)
    },
    beforeDestroy() {
        this.$root.$off('back', this.back)
    },
    methods: {
        ...mapActions([
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_HISTORY
        ]),
        back() {
            // 返回上一頁
            this[_M.SET_HISTORY]({mode: 'del'})
            this[_M.SET_HEADER_NAV_IS_BACK](false)
        }
    }
}
</script>
