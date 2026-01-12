<template>
    <div v-if="isShow">
        <component :is="currentRWD" />
        <GameSubmitBox v-if="isShowGameSubmitBox" />
        <GameSubmitSuccess :zIndex="2001" />
        <GameIssueBox :zIndex="2002" />
        <FeedbackMsgBox
            v-if="messageBoxData[2007]"
            :zIndex="2007"
        />
        <FeedbackMsgBox
            v-if="messageBoxData[2007]"
            :zIndex="2007"
        />
        <PrizePeriodEnd />
    </div>
</template>
<script>
import '@CSS/View/_v_game-la'
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import GamePlayerLA from '../../store/modules/GamePlayerLA'
import FeedbackMsgBox from './FeedbackMsgBox'
import GameIssueBox from './GameIssueBox'
import GameSubmitSuccess from './GameSubmitSuccess'
import PrizePeriodEnd from './PrizePeriodEnd'
import GameSubmitBox from './GameSubmitBox/'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'GamePlayerLA',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320,
        GameSubmitBox,
        GameSubmitSuccess,
        GameIssueBox,
        FeedbackMsgBox,
        PrizePeriodEnd
    },
    data() {
        return {
            timer: null,
            isShow: true,
            getConfigIntervalId: null
        }
    },
    subscriptions() {
        return {
            route$: this.$watchAsObservable('$route')
                .do(() => {
                    // this[_M.SET_SIN_SUBMIT_BOX_CAN_CANCEL](true)
                    // 重置投注額外選項
                    // this[_M.SET_GAME_OPTION]()
                })
                .do(this.handleRoute)
        }
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                // pageList: ['Desktop', 'Wallet', 'tools/lottery'],
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    created() {
        this.setStore({ GamePlayerLA })
        this[_M.SET_MENU_ID](9)
        // this[_M.GET_COLD_DOWN_VN_DATA]()
        // this[_M.GET_GAME_CONFIG_VN_DATA]()
    },
    async beforeMount() {
        this.getConfigIntervalId = setInterval(this.getDynamic, 15000)
        await this[_M.GET_GAME_PLAY_LA_DATA]({
            lotteryId: this.lotteryId
            // isLoadHistory: true
        })
        this.handleRoute({newValue: this.$route})
    },
    beforeDestroy() {
        clearInterval(this.getConfigIntervalId)
        this[_M.SET_LA_TEMP_DATA]({
            temp: 'LA_gameSelectData',
            data: {}
        })
        this[_M.SET_LA_TEMP_DATA]({
            temp: 'LA_gameOrder',
            data: {}
        })
        this[_M.SET_LA_TEMP_DATA]({
            temp: 'LA_money',
            data: ''
        })
        this[_M.SET_LA_TEMP_DATA]({
            temp: 'LA_menuIndex',
            data: 0
        })
        // this[_M.CLEAR_HISTORY_ORDER_TIMER]()
        // this[_M.REMOVE_SUBMIT_ALL_ORDER]()
        // this[_M.SET_SELECT_LOCK](false)
    },
    methods: {
        ...mapActions([
            _M.GET_STRING_POOL,
            _M.SET_MENU_ID,
            _M.SET_LA_TEMP_DATA,
            _M.GET_GAME_PLAY_LA_DATA,
            _M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_LA
        ]),
        getDynamic() {
            const diff = this.LA_number[this.LA_number.length - 1] - this.LA_lastnumber[this.LA_lastnumber.length - 1]
            const notYetUpdated = diff !== 1 && diff !== -9
            notYetUpdated && this[_M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_LA]()
        },
        async handleRoute({newValue, oldValue}) {
            if (oldValue) {
                const {params: { lottery: newlottery }, query: { m: newIndex }} = newValue
                const {params: { lottery: oldlottery }, query: { m: oldIndex }} = oldValue
                if (newlottery === oldlottery) {
                    newIndex !== oldIndex && this[_M.SET_LA_TEMP_DATA]({temp: 'LA_menuIndex', data: newIndex || 0})
                } else {
                    this[_M.SET_LA_TEMP_DATA]({
                        temp: 'LA_gameSelectData',
                        data: {}
                    })
                    await this[_M.GET_GAME_PLAY_LA_DATA]({
                        lotteryId: this.lotteryId
                    })
                    // 沒指定玩法位置就導回第一個玩法
                    const data = +this.$route.query.m || this.LA_firstGame
                    this[_M.SET_LA_TEMP_DATA]({temp: 'LA_menuIndex', data})
                }
            } else {
                const {query: { m: newIndex }} = newValue
                this[_M.SET_LA_TEMP_DATA]({temp: 'LA_menuIndex', data: +newIndex || 0})
            }
        }
    },
    props: {
        setStore: Function
    },
    computed: {
        ...mapGetters([
            'messageBoxData',
            'LA_number',
            'LA_lastnumber',
            'LA_firstGame'
        ]),
        lotteryId() {
            return this.$route.params.lottery
        },
        isShowGameSubmitBox() {
            return this.messageBoxData[1998] ? this.messageBoxData[1998].show : false
        }
    }
}
</script>
