<script>
import PageNation from '@C/PageNation'
import { mapGetters } from 'vuex'

export default {
    name: 'PageNation',
    mixins: [PageNation],
    methods: {
        search(page) {
            if (page === this.page) {
                return
            }
        },
        setPageNationNum(num) {
            if (num === this.num) {
                return
            }
        }
    },
    computed: {
        ...mapGetters([
            'winLoseData'
        ]),
        infoList() {
            return this.winLoseData
        }

    }
}
</script>