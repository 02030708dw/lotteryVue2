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
import { utc8 } from '@UTIL'

export default {
    name: 'HistoryTh',
    mixins: [RwdMixin],
    data() {
        return {
            startTime: '',
            endTime: ''
        }
    },
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

        // 進入頁面預設:泰國彩-1年、5分彩-當日
        const {menuCode = ''} = this.$route.query
        const dataFormat = 'YYYY-MM-DD'
        const startTime = utc8();
        +menuCode === 242 && startTime.add(-1, 'year')
        this.startTime = startTime.format(`${dataFormat} 00:00:56`)
        this.endTime = utc8().add(1, 'day').format(`${dataFormat} 00:00:55`)

        // 預載20期
        this[_M.GET_HB_LIST]({
            periodNums: 20,
            lotteryId: menuCode,
            next: null,
            startTime: this.startTime,
            endTime: this.endTime
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
            if (menuCode === '' || !lotData || lotData.menuId !== 6) {
                const firstLotId = this.lotteryMenu[6].list.reduce((ans, [lotKey, data]) => {
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
