<script>
import PageNation from '@C/PageNation'
import { mapGetters } from 'vuex'

export default {
    name: 'PageNation',
    mixins: [PageNation],
    methods: {
        // ...mapActions([
        //     _M.GET_REPORT_LIST
        // ]),
        search(page) {
            if (page === this.page) {
                return
            }
            // this[_M.GET_REPORT_LIST]({page})
        }
    },
    computed: {
        ...mapGetters([
            'reportList'
        ]),
        infoList() {
            return this.reportList
        }

    }
}
</script>