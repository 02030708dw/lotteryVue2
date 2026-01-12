<script>
import GameInfoDetailBox from '@C/GameInfoDetailBox'
import { mapGetters } from 'vuex'

export default {
    name: 'GameInfoDetailBox',
    mixins: [GameInfoDetailBox],
    props: {
        lotteryCountry: String
    },
    watch: {
        info() {
            this.$parent.cancel()
        }
    },
    methods: {
        back() {
            this.$parent.cancel()
        }
    },
    computed: {
        ...mapGetters([
            'gameInfoList',
            'GameInfoDetailIndex'
        ]),
        info() {
            if (!this.gameInfoList.pagination) {
                return {}
            }
            const index = this.GameInfoDetailIndex % this.gameInfoList.pagination.pageLimit
            return this.gameInfoList.data.list[index] || {}
        }
    }
}
</script>
<style lang="scss" scoped>
.gr_page-detail{
    max-height: 65vh;
    overflow-y: auto;
}
</style>