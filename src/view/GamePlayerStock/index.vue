<template>
    <div>
        <component :is="currentRWD" />
        <GameSubmitBox
            v-if="isShowGameSubmitBox"
            :zIndex="1998"
        />
        <GameSubmitSuccess :zIndex="2001" />
        <GameIssueBox :zIndex="2002" />
        <FeedbackMsgBox
            v-if="messageBoxData[2007]"
            :zIndex="2007"
        />
        <PrizePeriodEnd />
    </div>
</template>
<script>
import '@CSS/View/_v_game'
import RWD_980 from './980'
import GameSubmitBox from './GameSubmitBox'
import FeedbackMsgBox from './FeedbackMsgBox'
import GameIssueBox from './GameIssueBox'
import GameSubmitSuccess from './GameSubmitSuccess'
import PrizePeriodEnd from './PrizePeriodEnd'
import RwdMixin from '@C/RwdMixin'

import { mapActions, mapGetters } from 'vuex'
import GamePlayer from '@C/../store/modules/GamePlayer/'
import GameInfo from '@C/../store/modules/GameInfo/'
// import AddNewGameInfo from '@C/../store/modules/AddNewGameInfo/'
import GameInfoControl from '@C/../store/modules/GameInfoControl/'
export default {
    name: 'GamePlayerStock',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320: r => require.ensure([], () => r(require('./320')), 'GamePlayer320'),
        GameSubmitBox,
        FeedbackMsgBox,
        GameIssueBox,
        GameSubmitSuccess,
        PrizePeriodEnd
    },
    props: {
        setStore: Function
    },
    data() {
        return {
            getConfigIntervalId: null
        }
    },
    created() {
        //lazy load store
        this.setStore({
            GamePlayer,
            GameInfo,
            // AddNewGameInfo,
            GameInfoControl
        })
    },
    async beforeMount() {
        // 校正時間 & 更新獎期
        this.getConfigIntervalId = setInterval(this.getDynamic, 15000)

        await this[_M.GET_GAME_PLAY_DATA]({
            lotteryId: this.lotteryId,
            subGameName: this.subGameName,
            isLoadHistory: true
        })

        // 進入頁面時設定menuId
        this[_M.SET_MENU_ID](7)
    },
    beforeDestroy() {
        clearInterval(this.getConfigIntervalId)
        this[_M.CLEAR_HISTORY_ORDER_TIMER]()
        this[_M.REMOVE_SUBMIT_ALL_ORDER]()
        this[_M.SET_SELECT_LOCK](false)
    },
    subscriptions() {
        return {
            route$: this.$watchAsObservable('$route')
                .do(() => {
                    this[_M.SET_SIN_SUBMIT_BOX_CAN_CANCEL](true)
                    // 重置投注額外選項
                    this[_M.SET_GAME_OPTION]()
                })
                .do(async ({newValue, oldValue}) => {
                    const {params: { lottery: newlottery }, query: { sub: newsub }} = newValue
                    const {params: { lottery: oldlottery }, query: { sub: oldsub }} = oldValue
                    if (newlottery === oldlottery) {
                        newsub !== oldsub && this[_M.GET_GAME_INDEX](newsub)
                    } else {
                        await this[_M.GET_GAME_PLAY_DATA]({
                            lotteryId: this.lotteryId,
                            subGameName: this.subGameName
                        })
                    }
                })
        }
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    beforeRouteUpdate (to, from, next) {
        this[_M.GET_STRING_POOL]({
            pageList: ['all'],
            pageTitle: to.meta.title
        })
        next()
    },
    computed: {
        ...mapGetters([
            'game',
            'gameSubmit',
            'messageBoxData',
            'lotteryList',
            'lastnumber',
            'number'
        ]),
        lotteryId() {
            return this.$route.params.lottery
        },
        subGameName() {
            return this.$route.query.sub
        },
        ltProjectNum() {
            return this.gameSubmit.ltProjectNum
        },
        isShowGameSubmitBox() {
            return this.messageBoxData[1998] ? this.messageBoxData[1998].show : false
        }
    },
    methods: {
        ...mapActions([
            _M.GET_GAME_PLAY_DATA,
            _M.REMOVE_SUBMIT_ALL_ORDER,
            _M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL,
            _M.SET_SELECT_LOCK,
            _M.GET_STRING_POOL,
            _M.GET_GAME_INDEX,
            _M.SET_SIN_SUBMIT_BOX_CAN_CANCEL,
            _M.SET_KILL_PAIR,
            _M.CLEAR_HISTORY_ORDER_TIMER,
            _M.SET_IS_FAST,
            _M.SET_MENU_ID,
            _M.SET_GAME_OPTION
        ]),
        getDynamic() {
            const diff = this.number[this.number.length - 1] - this.lastnumber[this.lastnumber.length - 1]
            const notYetUpdated = diff !== 1 && diff !== -9
            notYetUpdated && this[_M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL]()
        }
    }
}
</script>
