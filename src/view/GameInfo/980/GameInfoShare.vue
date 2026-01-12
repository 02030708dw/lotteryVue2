<script>
import GameInfoShare from '@C/GameInfoShare'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'GameInfoShare',
    mixins: [GameInfoShare],
    props: ['lotteryCountry'],
    mounted() {
        this.$root.$on('back', this.back)
    },
    beforeDestroy() {
        this.$root.$off('back', this.back)
    },
    methods: {
        ...mapActions([
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_GAME_INFO_SHARE_INDEX
        ]),
        back() {
            this[_M.SET_HEADER_NAV_IS_BACK](false)
            this[_M.SET_GAME_INFO_SHARE_INDEX](-1)
            this.$nextTick(() => {
                const controllerComponent = this.$parent.$children.find(item => item.$vnode.componentOptions.tag === 'Controls')
                if (controllerComponent) controllerComponent.controllerToggle = false
            })
        }
    },
    computed: {
        ...mapGetters([
            'gameInfoList',
            'gameTempInfo',
            'GameInfoShareIndex',
            'GameInfoDetailIndex'
        ]),
        infoIndex() {
            return this.GameInfoDetailIndex === -1 ? this.GameInfoShareIndex : this.GameInfoDetailIndex
        },
        info() {
            const page = this.gameInfoList.pagination.page
            const index = this.infoIndex % this.gameInfoList.pagination.pageLimit
            return this.gameTempInfo[page].data.list[index]
        }
    }
}
</script>
