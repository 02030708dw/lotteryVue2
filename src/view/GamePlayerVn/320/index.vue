<template>
    <div>
        <HeaderNav />
        <div ref="container" v-if="!VN_isLoading">
            <GamesHeader
                :handleHistoryToggle="handleHistoryToggle"
                :recentOpen="showRecentResults"
                :trendOpen="showTrend"
                @trend-toggle="toggleTrend"
                @recent-toggle="toggleRecentResults"
            />
            <VnTrendPopup
                v-if="VN_isLocal"
                :visible="showTrend"
                :lotteryId="VN_lotteryId"
                @close="showTrend = false"
                @transitioning="handleOverlayTransition"
            />
            <VnRecentResultsMobile
                v-if="VN_isLocal"
                :visible="showRecentResults"
                :handleToggle="toggleRecentResults"
                @transitioning="handleOverlayTransition"
            />
            <GameMenu
                :isGameMenuActive="isGameMenuActive"
                :trendOpen="(showTrend || showRecentResults || overlayClosing) && VN_isLocal"
                v-show="!showGameBox"
            />
            <GameSubMenu v-show="!showGameBox" />

            <VN class="gr_game-vn" :currentGame="gameNameArr[VN_subMenuIndex]"
                v-show="!showGameBox && !isGameMenuActive" />
            <VN class="gr_game-vn" :currentGame="gameNameArr[VN_gameType][VN_subMenuIndex]"
                v-show="!showGameBox && !isGameMenuActive" />
            <GameBox v-show="showGameBox && !isGameMenuActive" :isFast="isFast" />
            <div class="gr_game-gameGroup" v-if="!isGameMenuActive">
                <GameStatistics v-show="!showGameBox" />
                <GameControlls :handleGameBox="handleGameBox" :showGameBox="showGameBox" :setIsFast="setIsFast"
                    :isFast="isFast" />
            </div>
            <InfoBox />
            <GameInfo />
        </div>
        <GamesHistoryMobile v-if="VN_isLocal && historyToggle" :handleHistoryToggle="handleHistoryToggle" />
        <!--  <GameRecord v-show="!isShowDemo && !gameVN.isLoading && !gameVN.isBallsLoading" />
        <MessageBox
            :zIndex="1996"
            className="el-detail-message-box"
        >
            <GameInfoDetailBox />
        </MessageBox>-->
        <!-- 加载中 -->
        <!-- <PageLoading
            :loading="VN_isLoading"
            :loadIngText="$t('home_020')"
        /> -->
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';

.gr_game-gameGroup {
    width: 100%;
    display: block;
    position: fixed;
    bottom: 0px;
    left: 0px;
    z-index: 50;
}
</style>
<script>
import RWD_980 from '../980'
import HeaderNav from '@C/HeaderNav/'
import GamesHeader from './GamesHeader'
import GameMenu from './GameMenu'
import GameSubMenu from './GameSubMenu'
import GamesHistoryMobile from './GamesHistoryMobile'
import VnRecentResultsMobile from './VnRecentResultsMobile'
import GameBox from './GameBox/'
import GameStatistics from './GameStatistics'
import GameControlls from './GameControlls'
import InfoBox from './InfoBox'
import GameInfo from './GameInfo'
import VnTrendPopup from './VnTrendPopup'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'RWD_320',
    mixins: [RWD_980],
    data() {
        return {
            showGameBox: false,
            isFast: false,
            isGameMenuActive: false,
            showTrend: false,
            showRecentResults: false,
            overlayClosing: false
        }
    },
    created() {
        this.$root.$on('back', this.back)
    },
    beforeDestroy() {
        this.$root.$off('back', this.back)
    },
    destroyed() {
        window.removeEventListener('scroll', this.scrollDown)
        document.body.removeEventListener('scroll', this.scrollDown)
    },
    mounted() {
        window.addEventListener('scroll', this.scrollDown)
        document.body.addEventListener('scroll', this.scrollDown)
    },
    computed: {
        ...mapGetters([
            'VN_nowStopId',
            'VN_nowblockedId',
            'VN_gameSubmit',
            'VN_localIssue',
            'VN_isLocal',
            'VN_lotteryId',
            'getPopActive'
        ]),
        historyToggle() {
            return this.getPopActive.VNhistory
        }
    },
    methods: {
        ...mapActions([
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_STOP_AND_OVER_VN_DATA,
            _M.SET_POP_ACTIVE
        ]),
        handleGameBox(showList = []) {
            const isStop = showList.find(({ methodId, issue }) => this.VN_nowStopId[methodId + (this.VN_localIssue || issue)])
            const isBlocked = showList.find(({ methodId, cityId }) => this.VN_nowblockedId[methodId] || this.VN_nowblockedId[cityId])
            const fn = () => {
                this.showGameBox = true
                this[_M.SET_HEADER_NAV_IS_BACK](true)
            }
            const fast = this.VN_gameType === 'Old' ? !this.isFast : this.isFast
            if (isBlocked) {
                return this.$root.$emit('blocked', { fn, isFilter: true, fast })
            } else if (isStop) {
                return this.$root.$emit('stopBet', { fn, isFilter: true, fast })
            }
            fn()
        },
        scrollDown() {
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
            const bodyScroll = document.body.classList
            if (scrollTop >= 100 && this.$route.name === 'GamePlayerVN') {
                bodyScroll.add('scrollDown')
            } else {
                bodyScroll.remove('scrollDown')
            }
        },
        back() {
            this.showGameBox = false
            this.showTrend = false
            this.showRecentResults = false
            this[_M.SET_HEADER_NAV_IS_BACK](false)
            this[_M.SET_STOP_AND_OVER_VN_DATA]()
        },
        setIsFast(bool) {
            this.isFast = bool
        },
        toggleTrend() {
            const next = !this.showTrend
            this.showTrend = next
            if (next) {
                this.showRecentResults = false
            }
            next && this.getPopActive.VNhistory && this[_M.SET_POP_ACTIVE]({ VNhistory: false })
        },
        toggleRecentResults(nextState) {
            const next = typeof nextState === 'boolean'
                ? nextState
                : !this.showRecentResults

            this.showRecentResults = next
            if (next) {
                this.showTrend = false
            }
        },
        handleOverlayTransition(isClosing) {
            this.overlayClosing = isClosing
        },
        handleHistoryToggle(nextState) {
            const next = typeof nextState === 'boolean'
                ? nextState
                : !this.getPopActive.VNhistory

            if (next) {
                this.showTrend = false
                this.showRecentResults = false
            }
            this[_M.SET_POP_ACTIVE]({ VNhistory: next })
        }
    },
    components: {
        HeaderNav,
        GamesHeader,
        // GameMenu,
        // GameMenuAll,
        GameMenu,
        GameSubMenu,
        GameBox,
        GameStatistics,
        GameControlls,
        InfoBox,
        GameInfo,
        GamesHistoryMobile,
        VnRecentResultsMobile,
        VnTrendPopup
    }
}
</script>
