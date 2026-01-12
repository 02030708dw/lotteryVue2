<template>
    <div>
        <HeaderNav />
        <div ref="container">
            <GamesHeader @showMedia="showMedia" />
            <GameHistory />
            <GameMenu v-show="!showGameBox"/>
            <TH
                class="gr_game-th"
                :currentGame="`TH_${TH_menuIndex + 1}D`"
                v-show="!showGameBox && !isGameMenuActive"
            />
            <GameBox v-show="showGameBox && !isGameMenuActive" />
            <div class="gr_game-gameGroup" v-if="!isGameMenuActive">
                <GameStatistics v-show="!showGameBox" />
                <GameControlls
                    :handleGameBox="handleGameBox"
                    :showGameBox="showGameBox"
                />
            </div>
             <!-- <InfoBox />
            <GameInfo /> -->
        </div>
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
import GameHistory from './GameHistory'
import GameMenu from './GameMenu'
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
            isGameMenuActive: false,
            isShowIframe: false,
            isShowVideo: false,
            isShowMedia: false
        }
    },
    beforeMount() {
        this.timer = setInterval(() => this[_M.GET_FLIP_TIMEER_TH](this), this.flipTimer.updateTime)
        this.$root.$on('back', this.back)
    },
    beforeDestroy() {
        this.$root.$off('back', this.back)
    },
    destroyed () {
        clearInterval(this.timer)
        window.removeEventListener('scroll', this.scrollDown)
        document.body.removeEventListener('scroll', this.scrollDown)
    },
    watch: {
        TH_lotteryId(v) {
            // 要先關閉影片，才不會在切換無影片彩種時影片還在
            if (v) {
                this.isShowVideo = false
                this.isShowIframe = false
            }
        }
    },
    mounted() {
        window.addEventListener('scroll', this.scrollDown)
        document.body.addEventListener('scroll', this.scrollDown)
    },
    methods: {
        ...mapActions([
            _M.SET_HEADER_NAV_IS_BACK,
            _M.GET_FLIP_TIMEER_TH
        ]),
        handleGameBox() {
            this.showGameBox = true
            this[_M.SET_HEADER_NAV_IS_BACK](true)
        },
        scrollDown() {
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
            const bodyScroll = document.body.classList
            if (scrollTop >= 100 && this.$route.name === 'GamePlayerTH') {
                bodyScroll.add('scrollDown')
                if (this.isShowIframe || this.isShowVideo) {
                    this.isShowIframe = false
                    this.isShowVideo = false
                    this.userOpenVideo = false
                }
            } else {
                bodyScroll.remove('scrollDown')
            }
        },
        back() {
            this.showGameBox = false
            this[_M.SET_HEADER_NAV_IS_BACK](false)
        },
        showMedia(v) {
            this.isShowMedia = v
        }
    },
    components: {
        HeaderNav,
        GamesHeader,
        GameHistory,
        GameMenu,
        GameBox,
        GameStatistics,
        GameControlls,
        InfoBox,
        GameInfo
    },
    computed: {
        ...mapGetters([
            'TH_flipTimer',
            'TH_lotteryId'
        ]),
        flipTimer() {
            return this.TH_flipTimer || {}
        }
    }
}
</script>
