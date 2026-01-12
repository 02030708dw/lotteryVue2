<template>
    <div>
        <HeaderNav />
        <div
            ref="container"
            v-if="!VN_isLoading"
        >
            <component
                :is="currentGameHeader"
                :historyToggle="historyToggle"
                :handleHistoryToggle="handleHistoryToggle"
                ref="initPos"
            />
            <GameMenu />
            <GameSubMenu />
            <VN :currentGame="gameNameArr[VN_gameType][VN_subMenuIndex]" />
            <GameControlls />
            <GameBox v-if="VN_gameType !== 'Old'" />
            <GamesHistory
                :style="{
                    left: dragX,
                    top: dragY
                }"
                v-if="VN_isLocal && historyToggle"
                :handleHistoryToggle="handleHistoryToggle"
                :handleDrag="handleDrag"
                :handleDrop="handleDrop"
            />
        </div>
        <!-- 加载中 -->
        <PageLoading
            :loading="VN_isLoading"
            v-show="VN_isLoading"
            :loadIngText="$t('home_020')"
        />
    </div>
</template>

<script>
import HeaderNav from '@C/HeaderNav/'
import PageLoading from '@C/PageLoading'
import GamesHeader from './GamesHeader'
import GamesHeaderLocal from './GamesHeaderLocal'
import GameMenu from './GameMenu'
import GameSubMenu from './GameSubMenu/'
import VN from '@C/games/VN'
import GameControlls from './GameControlls/'
import GamesHistory from './GamesHistory'
import GameBox from './GameBox'
// import GameRecord from './GameRecord'
// import GameInfoDetailBox from './GameRecord/GameInfoDetailBox'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'RWD_980',
    components: {
        HeaderNav,
        GamesHeader,
        GamesHeaderLocal,
        VN,
        GameControlls,
        GamesHistory,
        GameMenu,
        GameSubMenu,
        // GameRecord,
        PageLoading,
        GameBox
        // GameInfoDetailBox
    },
    data() {
        return {
            gameNameArr: {
                Old: [
                    'VN_2D_3D_4D',
                    'VN_PL2_PL3',
                    'VN_SP'
                ],
                Input: [
                    'VN_2D_3D_4D',
                    'VN_2D_3D_4D',
                    'VN_2D_3D_4D',
                    'VN_PL2_PL3',
                    'VN_PL2_PL3'
                ],
                Balls: [
                    'VN_2D_3D_4D',
                    'VN_2D_3D_4D',
                    'VN_2D_3D_4D',
                    'VN_PL2_PL3',
                    'VN_PL2_PL3'
                ],
                Quick: [
                    'VN_2D_3D_4D',
                    'VN_2D_3D_4D',
                    'VN_PL2_PL3',
                    'VN_PL2_PL3'
                ]
            },
            dragX: 0,
            dragY: 0,
            prevX: 0,
            prevY: 0,
            initX: 0,
            initY: 0,
            x: 0,
            y: 0,
            scrollTop: 0,
            scrollWidth: 0
        }
    },
    watch: {
        VN_isLocal() {
            !this.VN_isLocal && this.setHistoryToggle()
        }
    },
    beforeMount() {
        // 只有開"Old"的廳，即使網址代"Input"也要強制轉向Old
        this.VN_isOnlyOld && this.$router.replace({
            name: 'GamePlayerVN',
            query: { ...this.$route.query, t: 'Old' }
        })
    },
    destroyed () {
        this.removeListener()
    },
    methods: {
        ...mapActions([
            _M.SET_POP_ACTIVE
        ]),
        addListener() {
            this.addMoveListener()
        },
        removeListener() {
            this.removeMoveListener()
        },
        addMoveListener() {
            window.addEventListener('mousemove', this.handleMove)
            window.addEventListener('touchmove', this.handleMove)
        },
        removeMoveListener() {
            window.removeEventListener('mousemove', this.handleMove)
            window.removeEventListener('touchmove', this.handleMove)
        },
        handleDrag(e) {
            e.preventDefault()
            this.dragSource = e.target.offsetParent
            const { offsetLeft, offsetTop } = this.dragSource
            this.x = e.pageX || e.touches[0].pageX
            this.y = e.pageY || e.touches[0].pageY
            this.prevX = this.x - offsetLeft
            this.prevY = this.y - offsetTop
            this.scrollTop = window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0
            this.scrollWidth = document.body.scrollWidth ||
                document.documentElement.scrollWidth
            this.addListener()
        },
        handleMove(e) {
            const { width, height } = this.dragSource.getBoundingClientRect()
            this.x = e.pageX || e.touches[0].pageX
            this.y = e.pageY || e.touches[0].pageY
            this.dragX = Math.min(Math.max(this.x - this.prevX, 0), this.scrollWidth - width) + 'px'
            this.dragY = Math.min(Math.max(this.y - this.prevY, this.scrollTop), window.innerHeight - height + this.scrollTop) + 'px'
        },
        handleDrop() {
            this.removeListener()
        },
        handleHistoryToggle() {
            const initPos = this.$refs.initPos.$refs
            const {left, top} = initPos.initPos.getBoundingClientRect()
            const scrollTop = +document.documentElement.scrollTop
            this.initX = left
            this.initY = top + scrollTop
            this[_M.SET_POP_ACTIVE]({VNhistory: !this.getPopActive.VNhistory})
            if (this.getPopActive.VNhistory) {
                this.dragX = this.initX + 'px'
                this.dragY = this.initY + 'px'
            }
        },
        setHistoryToggle() {
            this[_M.SET_POP_ACTIVE]({VNhistory: false})
        }
    },
    computed: {
        ...mapGetters([
            'VN_isLoading',
            'VN_subMenuIndex',
            'VN_isLocal',
            'VN_gameType',
            'VN_isOnlyOld',
            'getPopActive'
        ]),
        currentGameHeader() {
            return this.VN_isLocal ? 'GamesHeaderLocal' : 'GamesHeader'
        },
        historyToggle() {
            return this.getPopActive.VNhistory
        }
    }
}
</script>
