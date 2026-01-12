<template>
    <div class="gr_game-info">
        <component
            :is="currentRWD"
            :lotteryCountry="lotteryCountry"
            :changeLotteryCountry="changeLotteryCountry"
        />
        <!-- <MessageBox
            :zIndex="1996"
            className="el-detail-message-box"
        >
            <GameInfoDetailBox v-if="RWDMode === 1" :lotteryCountry="lotteryCountry" />
            <DateInfoBox v-if="RWDMode === 3" />
        </MessageBox> -->
        <MessageBox
            :zIndex="1996"
            className="el-detail-message-box"
        >
            <GameInfoDetailBox v-if="RWDMode === 1" :lotteryCountry="lotteryCountry" />
            <DateInfoBox v-if="RWDMode === 3" />
        </MessageBox>
        <MessageBox
            :zIndex="1997"
            className="el-detail-message-box"
        >
            <GameInfoShareBox v-if="RWDMode === 1" :lotteryCountry="lotteryCountry" />
        </MessageBox>
    </div>
</template>

<script>
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import { mapActions, mapGetters } from 'vuex'
import { today } from '@UTIL'
import GameInfoDetailBox from './980/GameInfoDetailBox'
import GameInfoShareBox from './980/GameInfoShareBox'
import GameInfo from '@C/../store/modules/GameInfo/'
import GameInfoControl from '@C/../store/modules/GameInfoControl/'
import GamePlayer from '@C/../store/modules/GamePlayer/'
import GamePlayerVN from '../../store/modules/GamePlayerVN'
import DateInfoBox from '@C/DateInfoBox'
export default {
    name: 'GameInfo',
    data() {
        return {
            routerName: '/GameInfo',
            lotteryCountry: 'cn',
            tabList: {
                1: 'cn',
                2: 'cn',
                3: 'vn',
                4: 'cn',
                5: 'ft',
                6: 'th',
                7: 'stock',
                8: 'bjl',
                9: 'la',
                10: 'my'
            }
        }
    },
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320,
        GameInfoDetailBox,
        GameInfoShareBox,
        DateInfoBox
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                // pageList: ['Desktop', 'GamePlayer', 'GameInfo', 'Message', 'tools/lottery'],
                pageList: ['all'],
                pageTitle: to.meta.title
            })
            // 初次進入頁面清空搜尋資料
            that[_M.CLEAR_GAME_INFO_DATA]()
        })
    },
    created() {
        //lazy load store
        this.setStore({
            GamePlayer,
            GameInfo,
            GameInfoControl,
            GamePlayerVN
        })
        const params = {
            startDate: today(),
            endDate: today(),
            pageLimit: 20
        }
        const firstMenuId = this.lotteryMenuData[0].menuType
        this.lotteryCountry = this.tabList[firstMenuId]
        this[_M.SET_GAME_INFO_DATA](params)
    },
    watch: {
        currentRWD() {
            this[_M.CLEAR_GAME_INFO_DATA]()
            this.$router.replace(`${this.routerName}`)
            // 清掉投注時間
            if (this.lotteryCountry === 'vn') {
                this[_M.SET_GAME_INFO_DATA]({
                    startDate: null,
                    endDate: null
                })
            }
        },
        lotteryCountry() {
            // this[_M.CLEAR_GAME_INFO_DATA]({})
            this[_M.SET_GAME_INFO_LIST]({})
            this[_M.SET_GAME_INFO_SUM]({
                sum_bonus: 0,
                sum_total_price: 0
            })
        }
    },
    destroyed() {
        this[_M.SET_HEADER_NAV_IS_BACK](false)
        this[_M.CLEAR_GAME_INFO_DATA]()
    },
    methods: {
        ...mapActions([
            _M.SET_GAME_INFO_DATA,
            _M.SET_HEADER_NAV_IS_BACK,
            _M.CLEAR_GAME_INFO_DATA,
            _M.GET_STRING_POOL,
            _M.SET_GAME_INFO_LIST,
            _M.SET_GAME_INFO_SUM
        ]),
        changeLotteryCountry(val) {
            this.lotteryCountry = val
        }
    },
    props: {
        setStore: Function
    },
    computed: {
        ...mapGetters([
            'GameInfoDetailIndex',
            'GameInfoShareIndex',
            'lotteryMenuData',
            'RWDMode'
        ])
    }
}
</script>
