<template>
    <div>
        <HeaderNav @favorites_active="_favorites_active"/>
        <div v-if="!game.isLoading" v-show="!game.isBallsLoading">
            <GamesHeader/>
            <GameHistory/>
            <GameMenu v-show="gameShowMode === 0"/>
            <GameBalls/>
            <InfoBox
                :zIndex="1996"
            />
        </div>
        <!-- 加载中 -->
        <PageLoading
            v-if="game.isBallsLoading"
            :loading="game.isBallsLoading"
            :loadIngText="$t('home_020')"
        />

    </div>
</template>
<script>
import HeaderNav from '@C/HeaderNav/'
import GamesHeader from './GamesHeader'
import GameHistory from './GameHistory'
import GameMenu from './GameMenu'
import GameBalls from './GameBalls'
import InfoBox from './InfoBox'
import RWD_980 from '../980'
import { mapGetters, mapActions } from 'vuex'
import { Observable } from 'rxjs/Observable'

export default {
    name: 'RWD_320',
    mixins: [RWD_980],
    components: {
        HeaderNav,
        GamesHeader,
        GameHistory,
        GameMenu,
        GameBalls,
        InfoBox
    },
    beforeMount() {
        this.addScrollEl()
    },
    beforeDestroy() {
        this[_M.SET_GAME_SHOW_MODE](0)
        this[_M.SET_HEADER_NAV_IS_BACK](false)
        this.removeScrollEl()
    },
    subscriptions() {
        return {
            timer$: Observable
                .interval(this.flipTimer.updateTime)
                .do(() => this.is2Timer ? this[_M.GET_FLIP_TIMEER_MUTI](this) : this[_M.GET_FLIP_TIMEER](this))
        }
    },
    watch: {
        gameMenuActive(v) {
            v ? this.removeScrollEl() : this.addScrollEl()
        }
    },
    computed: {
        ...mapGetters([
            'gameShowMode',
            'flipTimer',
            'gameMenuActive',
            'currentjsDynamicData'
        ]),
        // 判斷當前是否有兩期以上可以投注
        is2Timer() {
            return (this.currentjsDynamicData.issue || []).length > 0
        }
    },
    methods: {
        ...mapActions([
            _M.GET_FLIP_TIMEER,
            _M.GET_FLIP_TIMEER_MUTI,
            _M.SET_GAME_SHOW_MODE,
            _M.SET_HEADER_NAV_IS_BACK
        ]),
        scrollDown() {
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
            const bodyScroll = document.body.classList
            if (scrollTop >= 100 && this.$route.name === 'GamePlayerStock') {
                bodyScroll.add('scrollDown')
            } else {
                bodyScroll.remove('scrollDown')
            }
        },
        removeScrollEl() {
            window.removeEventListener('scroll', this.scrollDown)
            document.body.removeEventListener('scroll', this.scrollDown)
        },
        addScrollEl() {
            window.addEventListener('scroll', this.scrollDown)
            document.body.addEventListener('scroll', this.scrollDown)
        },
        _favorites_active(v) {
            v ? this.removeScrollEl() : this.addScrollEl()
        }
    }
}
</script>
