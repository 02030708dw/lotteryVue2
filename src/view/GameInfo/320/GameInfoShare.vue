<script>
import GameInfoShare from '../980/GameInfoShare'

export default {
    name: 'GameInfoShare',
    mixins: [GameInfoShare],
    computed: {
        info() {
            const formula = this.gameInfoList.pagination ? this.gameInfoList.pagination.pageLimit : 1
            const page = Math.ceil((this.GameInfoShareIndex + 1) / formula)
            const index = this.GameInfoShareIndex % formula

            try {
                return this.gameTempInfo[page].data.list[index] || {}
            } catch (e) {
                console.warn('GameInfoShare320 info error!')
                return {}
            }
        }
    },
    methods: {
        async userProjectCancel(projectId) {
            // await this[_M.ACTION_PROJECT_CANCEL]({projectId, $this: this, fn: this.$root.handleAction, countryType: this.lotteryCountry})
            await this[_M.ACTION_PROJECT_CANCEL]({
                projectId,
                $this: this,
                fn: () => {
                    this.back()
                },
                countryType: this.lotteryCountry
            })
        }
    }
}
</script>
