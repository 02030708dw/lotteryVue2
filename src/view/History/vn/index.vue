<template>
    <component :is="currentRWD" />
</template>
<script>
import { today } from '@UTIL'
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import GamePlayerVN from '@S/modules/GamePlayerVN'
import HistoryBallVN from '@S/modules/HistoryBallVN'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'HistoryVN',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320
    },
    props: {
        setStore: Function
    },
    beforeMount() {
        this.setStore({ GamePlayerVN, HistoryBallVN })
        // 離開時，清空最後一期的紀錄
        this[_M.GET_HISTORYBALLVN_LIST]({ menuCode: this.routerMenuCode() })
    },
    destroyed() {
        this[_M.CLEAR_HISTORYBALLVN_LIST]()
        this[_M.SET_HISTORYBALLVN_DATA]({next: null})
        this[_M.SET_HISTORYBALLVN_DATA]({cancelDeadline: today()})
    },
    computed: {
        ...mapGetters([
            'lotteryMenu',
            'officialKeyVN'
        ])
    },
    methods: {
        ...mapActions([
            _M.GET_HISTORYBALLVN_LIST,
            _M.SET_HISTORYBALLVN_DATA,
            _M.CLEAR_HISTORYBALLVN_LIST
        ]),
        routerMenuCode() {
            const {menuCode = ''} = this.$route.query
            const [key] = menuCode.split('-')
            // 找不到 或 沒給menuCode 導到有開放之第一個玩法
            const vnData = this.lotteryMenu[3].list
            if (!vnData[key] || !menuCode) {
                const menuKeys = Object.keys(vnData)
                if (this.officialKeyVN.includes(menuKeys[0])) {
                    const menuCode = menuKeys[0] + '-'
                    this.$router.replace({ name: 'History', query: { menuCode } })
                    return menuCode
                } else {
                    const key = menuKeys[0]
                    const menuCode = key + '-' + vnData[key].childs[0].lottery
                    this.$router.replace({ name: 'History', query: { menuCode } })
                    return menuCode
                }
            }
            return menuCode
        }
    }

}
</script>
