<template>
    <div>
        <HeaderNav />
        <div
            ref="container"
        >
            <GameHeader />
            <GameMenu />
            <MY :currentGame="`MY_${MY_menuIndex + 1}D`" />
            <GameControlls />
            <GameBox />
            <GamesHistory
                :style="{
                    left: dragX,
                    top: dragY
                }"
                v-if="historyToggle"
                @mousedown.native="handleDrag"
                @touchstart.native="handleDrag"
                @mouseup.native="handleDrop"
                @touchend.native="handleDrop"
            />
        </div>
    </div>
</template>

<script>
import HeaderNav from '@C/HeaderNav/'
import PageLoading from '@C/PageLoading'
// <MY :currentGame="gameNameArr[MY_gameType][VN_subMenuIndex]" />

// import GamesHeader from './GamesHeader'
// import GamesHeaderLocal from './GamesHeaderLocal'
import GameMenu from './GameMenu'
import GameHeader from './GameHeader'
import MY from '@C/games/MY'
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
        GameHeader,
        MY,
        GameControlls,
        GamesHistory,
        GameMenu,
        // GameRecord,
        PageLoading,
        GameBox
        // GameInfoDetailBox
    },
    data() {
        return {
            dragX: 0,
            dragY: 0
        }
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
        handleHistoryToggle(e) {
            this[_M.SET_POP_ACTIVE]({history: !this.getPopActive.history})
            if (this.getPopActive.history) {
                const content = e.target.offsetParent.querySelector('.gr_number__content')
                const {left, top} = content.getBoundingClientRect()
                const scrollTop = +document.documentElement.scrollTop
                this.initX = left
                this.initY = top + scrollTop
                this.dragX = this.initX + 'px'
                this.dragY = this.initY + 'px'
            }
        },
        setHistoryToggle() {
            this[_M.SET_POP_ACTIVE]({history: false})
        }
    },
    computed: {
        ...mapGetters([
            'MY_menuIndex',
            'MY_gameType',
            'getPopActive'
        ]),
        historyToggle() {
            return this.getPopActive.history
        }
    }
}
</script>
