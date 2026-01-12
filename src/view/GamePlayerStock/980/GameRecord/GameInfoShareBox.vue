<script>
import GameInfoShareBox from '@C/GameInfoShareBox'
import { mapGetters } from 'vuex'

export default {
    name: 'GameInfoShareBox',
    mixins: [GameInfoShareBox],
    props: {
        lotteryCountry: String
    },
    methods: {
        back() {
            this.$parent.cancel()
        }
    },
    watch: {
        info() {
            this.$parent.cancel()
        }
    },
    computed: {
        ...mapGetters([
            'gameInfoList',
            'GameInfoShareIndex'
        ]),
        info() {
            if (!this.gameInfoList.pagination) {
                return {}
            }
            const index = this.GameInfoShareIndex % this.gameInfoList.pagination.pageLimit
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