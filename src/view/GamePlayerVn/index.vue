<template>
    <div v-if="isShow">
        <component :is="currentRWD" />
        <GameSubmitBox v-if="isShowGameSubmitBox" />
        <GameSubmitSuccess :zIndex="2001" />
        <GameIssueBox :zIndex="2002" />
        <StopMsgBox :zIndex="2003" />
        <BlockedMsgBox :zIndex="2005" />
        <FeedbackMsgBox
            v-if="messageBoxData[2007]"
            :zIndex="2007"
        />
        <PrizePeriodEnd />
    </div>
</template>
<script>
import '@CSS/View/_v_game-vn'
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import GamePlayerVN from '../../store/modules/GamePlayerVN'
import FeedbackMsgBox from './FeedbackMsgBox'
import GameIssueBox from './GameIssueBox'
import StopMsgBox from './StopMsgBox'
import BlockedMsgBox from './BlockedMsgBox'
import GameSubmitSuccess from './GameSubmitSuccess'
import GameSubmitBox from './GameSubmitBox/'
import PrizePeriodEnd from './PrizePeriodEnd'
import { mapActions, mapGetters } from 'vuex'
import blockedFilter from '@C/games/VN/helpers/blockedFilter'
export default {
    name: 'GamePlayerVN',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320,
        GameSubmitBox,
        StopMsgBox,
        BlockedMsgBox,
        GameIssueBox,
        GameSubmitSuccess,
        FeedbackMsgBox,
        PrizePeriodEnd
    },
    data() {
        return {
            timer: null,
            isShow: false
        }
    },
    subscriptions() {
        return {
            route$: this.$watchAsObservable('$route')
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
        this.setStore({ GamePlayerVN })
        this[_M.GET_COLD_DOWN_VN_DATA]()
        this[_M.GET_GAME_CONFIG_VN_DATA]()
    },
    beforeMount() {
        this.$root.$on('stopBet', this.handleStopBet)
        this.$root.$on('blocked', this.handleBlocked)
        this.handleRoute({newValue: this.$route})
        this.timer = setInterval(this[_M.GET_FLIP_TIMEER_VN], 1000)
        this[_M.SET_MENU_ID](3)

        // 980 切換到越南彩回頂
        document.documentElement.scrollTop = 0
    },
    destroyed() {
        this[_M.RESET_GAME_VN]()
        this.$root.$off('stopBet', this.handleStopBet)
        this.$root.$off('blocked', this.handleBlocked)
        clearInterval(this.timer)
    },
    methods: {
        ...mapActions([
            _M.GET_STRING_POOL,
            _M.RESET_GAME_VN,
            _M.SET_GAME_VN_DATA,
            _M.GET_FLIP_TIMEER_VN,
            _M.GET_COLD_DOWN_VN_DATA,
            _M.GET_GAME_CONFIG_VN_DATA,
            _M.SET_MENU_ID,
            _M.SET_MESSAGE_BOX_DATA
        ]),
        handleRoute({newValue}) {
            if (this.VN_isAllClose) {
                return this.$router.replace('/')
            }
            let {query: { t: newType, p: newPos, m: newM = 0, l: lotteryId = 0 }} = newValue
            // newPos 如果有單式預設在南部
            if (newPos === undefined) {
                if (this.VN_isOnlyOld) {
                    newPos = 0
                } else {
                    newPos = 1
                }
            }
            // 全區只有經典版
            if (!newType) {
                if (this.VN_isOnlyOld || !newPos) {
                    newType = 'Old'
                } else {
                    newType = this.entrance
                }
            }
            let obj = { VN_menuIndex: +newPos, VN_subMenuIndex: +newM, lotteryId, VN_gameType: newType }
            if (+lotteryId) {
                // 自主彩
                if (this.lotteryListLocalVN[lotteryId]) {
                    !newPos && (obj.VN_menuIndex = 1)
                } else {
                    if (this.VN_localFirstLottery) {
                        obj.lotteryId = this.VN_localFirstLottery.lottery
                    } else {
                        return this.$router.replace('/')
                    }
                }
            } else {
                if (!this.VN_hasOfficial) {
                    // 如果沒有官彩
                    obj.VN_menuIndex = 1
                    if (this.VN_localFirstLottery) {
                        obj.lotteryId = this.VN_localFirstLottery.lottery
                    } else {
                        return this.$router.replace('/')
                    }
                } else {
                    //p的地區玩法全關則導頁回全區
                    const pos = this.VN_gameMenu[newPos].key
                    const isBlocked = !this.VN_lotteryOfficialSwitch[pos]
                    if (isBlocked) {
                        const pos = this.lotteryVN[0]
                        const index = this.VN_gameMenu.findIndex(({key}) => pos === key)
                        obj.VN_menuIndex = index
                        this.$router.replace(`/GamePlayerVN?p=${index}`)
                    } else {
                        obj.VN_menuIndex = +newPos
                    }
                }
            }
            //更新VN_menuIndex
            this[_M.SET_GAME_VN_DATA](obj)
            //m的玩法被關閉則+1或歸0
            const len = this.VN_gameMenuSub.length
            for (let i = 0; i < len; i++) {
                const method = this.VN_gameMenuSub[newM].title_key
                const isBlocked = this.checkIsAllAreaBlocked(method)

                if (!isBlocked) {
                    obj.VN_subMenuIndex = +newM
                    break
                }

                if (newM < len - 1) newM++
                else newM = 0
            }

            this[_M.SET_GAME_VN_DATA](obj)
            this.isShow = true
        },
        checkIsAllAreaBlocked(title_key) {
            return blockedFilter.checkIsAllAreaBlocked(title_key, this)
        },
        handleStopBet({ fn = () => {}, fast = false, isFilter } = {}) {
            if (this.VN_nowStopData.length) {
                this.$msg({
                    fast,
                    isFilter,
                    show: true,
                    zIndex: 2003,
                    errorCode: 9501,
                    type: 'warning',
                    beforeConfirm: fn
                })
            }
        },
        handleBlocked({ fn = () => {}, fast = false, isFilter } = {}) {
            if (this.VN_nowblockedData.length) {
                this.$msg({
                    fast,
                    isFilter,
                    show: true,
                    zIndex: 2005,
                    type: 'warning',
                    beforeConfirm: fn
                })
            }
        }
    },
    props: {
        setStore: Function
    },
    computed: {
        ...mapGetters([
            'VN_menuIndex',
            'VN_nowStopData',
            'VN_nowblockedData',
            'lotteryVN',
            'VN_gameMenu',
            'VN_hasInput',
            'VN_hasQuick',
            'VN_hasBall',
            'VN_isOnlyOld',
            'VN_hasOfficial',
            'messageBoxData',
            'VN_gameMenuSub',
            'lotteryListLocalVN',
            'VN_localFirstLottery',
            'VN_lotteryOfficialSwitch',
            'VN_isAllClose'
        ]),
        entrance() {
            if (this.VN_hasInput) {
                return 'Input'
            } else if (this.VN_hasQuick) {
                return 'Quick'
            }
            return 'Balls'
        },
        isShowGameSubmitBox() {
            return this.messageBoxData[1998] ? this.messageBoxData[1998].show : false
        }
    }
}
</script>