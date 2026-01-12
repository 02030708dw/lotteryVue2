<script>
import GameInfoShareBox from '@C/GameInfoShareBox'
import { Observable } from 'rxjs/Observable'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'GameInfoShareBox',
    mixins: [GameInfoShareBox],
    subscriptions() {
        return {
            RWD$: this.$watchAsObservable('RWDMode')
                .pluck('newValue')
                .filter(mode => mode === 3)
                .do(() => this.$parent.cancel())
        }
    },
    props: ['lotteryCountry'],
    methods: {
        ...mapActions([
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_GAME_INFO_DETAIL_INDEX,
            _M.SET_GAME_INFO_LIST
        ]),
        back() {
            this.$parent.cancel()
            this[_M.SET_HEADER_NAV_IS_BACK](false)
            this[_M.SET_GAME_INFO_DETAIL_INDEX](-1)
        },
        async userProjectCancel(projectId) {
            this.isActions = true
            await this[_M.ACTION_PROJECT_CANCEL]({projectId, $this: this, fn: this.$root.handleAction, countryType: this.lotteryCountry})

            // update status to infolist
            let list = JSON.parse(JSON.stringify(this.gameInfoList))
            list.data.list[this.GameInfoDetailIndex].is_cancel = this.info.is_cancel
            list.params.calSum = false
            this[_M.SET_GAME_INFO_LIST](list)
        }
    },
    computed: {
        ...mapGetters([
            'gameInfoList',
            'gameTempInfo',
            'GameInfoShareIndex',
            'GameInfoDetailIndex',
            'RWDMode'
        ]),
        info() {
            if (!this.gameInfoList.pagination) {
                return {}
            }
            const page = this.gameInfoList.pagination.page
            const index = this.infoIndex % this.gameInfoList.pagination.pageLimit
            return this.gameInfoList.data.list[index]
        },
        infoIndex() {
            return this.GameInfoDetailIndex === -1 ? this.GameInfoShareIndex : this.GameInfoDetailIndex
        }
    }
}
</script>
