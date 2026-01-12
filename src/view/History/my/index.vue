<template>
    <component :is="currentRWD" />
</template>
<script>
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import GamePlayer from '@S/modules/GamePlayer'
import HistoryBall from '@S/modules/HistoryBall'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'HistoryMY',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320
    },
    props: {
        setStore: Function
    },
    async beforeMount() {
        this.setStore({
            GamePlayer,
            HistoryBall
        })
        // 檢查router是否合法
        await this.routerCheck()

        // 進入頁面預設取得當月的資料
        const {menuCode = ''} = this.$route.query
        const startTime = moment().format('YYYY-MM-01 00:00:00')
        const endTime = moment().endOf('month').format('YYYY-MM-DD 23:59:59')

        // 即使一日兩期,單月不超過50期
        this[_M.GET_HB_LIST]({
            periodNums: 50,
            lotteryId: menuCode,
            startTime,
            endTime
        })
    },
    beforeDestroy() {
        // 離開清空列表
        this[_M.SET_HB_LIST]()
    },
    computed: {
        ...mapGetters([
            'lotteryMenu',
            'lotteryList2'
        ])
    },
    methods: {
        ...mapActions([
            _M.GET_HB_LIST,
            _M.SET_HB_LIST
        ]),
        routerCheck() {
            const {menuCode = ''} = this.$route.query
            const lotData = this.lotteryList2[menuCode]
            // 沒給menuCode 或 ID不存在 導到有開放之第一個玩法
            if (menuCode === '' || !lotData || lotData.menuId !== 10) {
                const firstLotId = this.lotteryMenu[10].list.reduce((ans, [lotKey, data]) => {
                    const ch = data.childs || []
                    if (ans === '' && ch[0]) {
                        ans = ch[0].lottery
                    }
                    return ans
                }, '')

                this.$router.replace({ name: 'History', query: { menuCode: firstLotId } })
            }
        }
    }

}
</script>
