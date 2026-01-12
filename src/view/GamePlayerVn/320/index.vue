<template>
    <div>
        <HeaderNav />
        <div
            ref="container"
            v-if="!VN_isLoading"
        >
            <GamesHeader />
            <GameMenu :isGameMenuActive="isGameMenuActive" v-show="!showGameBox" />
            <GameSubMenu v-show="!showGameBox" />

            <VN
                class="gr_game-vn"
                :currentGame="gameNameArr[VN_subMenuIndex]"
                v-show="!showGameBox && !isGameMenuActive"
            />
            <VN
                class="gr_game-vn"
                :currentGame="gameNameArr[VN_gameType][VN_subMenuIndex]"
                v-show="!showGameBox && !isGameMenuActive"
            />
            <GameBox v-show="showGameBox && !isGameMenuActive" :isFast="isFast" />
            <div class="gr_game-gameGroup" v-if="!isGameMenuActive">
                <GameStatistics v-show="!showGameBox" />
                <GameControlls
                    :handleGameBox="handleGameBox"
                    :showGameBox="showGameBox"
                    :setIsFast="setIsFast"
                    :isFast="isFast"
                />
            </div>
             <InfoBox />
            <GameInfo />
        </div>
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

import GameBox from './GameBox/'
import GameStatistics from './GameStatistics'
import GameControlls from './GameControlls'
import InfoBox from './InfoBox'
import GameInfo from './GameInfo'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'RWD_320',
    mixins: [RWD_980],
    data() {
        return {
            showGameBox: false,
            isFast: false,
            isGameMenuActive: false
        }
    },
    created() {
        this.$root.$on('back', this.back)
    },
    beforeDestroy() {
        this.$root.$off('back', this.back)
    },
    destroyed () {
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
            'VN_localIssue'
        ])
    },
    methods: {
        ...mapActions([
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_STOP_AND_OVER_VN_DATA
        ]),
        handleGameBox(showList = []) {
            const isStop = showList.find(({methodId, issue}) => this.VN_nowStopId[methodId + (this.VN_localIssue || issue)])
            const isBlocked = showList.find(({methodId, cityId}) => this.VN_nowblockedId[methodId] || this.VN_nowblockedId[cityId])
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
            this[_M.SET_HEADER_NAV_IS_BACK](false)
            this[_M.SET_STOP_AND_OVER_VN_DATA]()
        },
        setIsFast(bool) {
            this.isFast = bool
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
        GameInfo
    }
}
</script>
