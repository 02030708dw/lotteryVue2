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
import '@CSS/View/_v_game-th'
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import GamePlayerTH from '../../store/modules/GamePlayerTH'
import FeedbackMsgBox from './FeedbackMsgBox'
import GameIssueBox from './GameIssueBox'
import GameSubmitSuccess from './GameSubmitSuccess'
import PrizePeriodEnd from './PrizePeriodEnd'
import GameSubmitBox from './GameSubmitBox/'
import { mapActions, mapGetters } from 'vuex'
import blockedFilter from '@C/games/VN/helpers/blockedFilter'
export default {
    name: 'GamePlayerTH',
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
                .do(async ({newValue, oldValue}) => {
                    const {params: { lottery: newlottery }, query: { m: newIndex }} = newValue
                    const {params: { lottery: oldlottery }, query: { m: oldIndex }} = oldValue
                    if (newlottery === oldlottery) {
                        newIndex !== oldIndex && this[_M.SET_TH_TEMP_DATA]({temp: 'TH_menuIndex', data: newIndex})
                    } else {
                        this[_M.SET_TH_TEMP_DATA]({
                            temp: 'TH_gameSelectData',
                            data: {}
                        })
                        await this[_M.GET_GAME_PLAY_TH_DATA]({
                            instance: this,
                            lotteryId: this.lotteryId
                        })
                        // 沒指定玩法位置就導回第一個玩法
                        const data = +this.$route.query.m || this.TH_firstGame
                        this[_M.SET_TH_TEMP_DATA]({temp: 'TH_menuIndex', data})
                    }
                })
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
        this.setStore({ GamePlayerTH })
        this[_M.SET_MENU_ID](6)
        // this[_M.GET_COLD_DOWN_VN_DATA]()
        // this[_M.GET_GAME_CONFIG_VN_DATA]()
    },
    async beforeMount() {
        this.getConfigIntervalId = setInterval(this.getDynamic, 15000)
        await this[_M.GET_GAME_PLAY_TH_DATA]({
            instance: this,
            lotteryId: this.lotteryId
            // isLoadHistory: true
        })
        const data = +this.$route.query.m || this.TH_firstGame
        this[_M.SET_TH_TEMP_DATA]({temp: 'TH_menuIndex', data})
    },
    beforeDestroy() {
        clearInterval(this.getConfigIntervalId)
        this[_M.SET_TH_TEMP_DATA]({
            temp: 'TH_gameSelectData',
            data: {}
        })
        this[_M.SET_TH_TEMP_DATA]({
            temp: 'TH_money',
            data: ''
        })
        // this[_M.CLEAR_HISTORY_ORDER_TIMER]()
        // this[_M.REMOVE_SUBMIT_ALL_ORDER]()
        // this[_M.SET_SELECT_LOCK](false)
    },
    methods: {
        ...mapActions([
            _M.GET_STRING_POOL,
            _M.SET_MENU_ID,
            _M.SET_TH_TEMP_DATA,
            _M.GET_GAME_PLAY_TH_DATA,
            _M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_TH
        ]),
        getDynamic() {
            const diff = this.TH_number[this.TH_number.length - 1] - this.TH_lastnumber[this.TH_lastnumber.length - 1]
            const notYetUpdated = diff !== 1 && diff !== -9
            notYetUpdated && this[_M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_TH]()
        }
    },
    props: {
        setStore: Function
    },
    computed: {
        ...mapGetters([
            'messageBoxData',
            'TH_number',
            'TH_lastnumber',
            'TH_firstGame'
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
