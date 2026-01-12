<template>
    <div ref="upper">
        <component :is="gameType" />
        <MessageBox
            :zIndex="1992"
            className="gr_news-message-box gr_board-message-box"
            :class="{is_horizontal: is_horizontal}"
        >
            <ScoreBoard/>
        </MessageBox>
        <div
            v-if="isMobile"
            ref="mask"
            class="moveMask"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
        >
            <p>
                <!-- '向上滑动可全屏游戏' -->
                {{$t('Glory_5018')}}
                <br />
                <!-- '如果浏览器不支持滑动全屏' -->
                {{$t('Glory_5019')}}
                <br />
                <!-- '请点击屏幕直接进入' -->
                {{$t('Glory_5020')}}
            </p>
        </div>
    </div>
</template>

<style lang="scss">

.moveMask {
    position: absolute;
    text-align: center;
    font-size: 20px;
    color: rgb(255, 255, 255);
    left: 0px; top: 0px;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    visibility: hidden;
    width: 100%;
    height: 130vh;
    p {
        margin-top: 60px;
        &::before {
            content: '';
            width: 40px;
            height: 40px;
            transform: translateX(-50%) rotate(45deg);
            position: fixed;
            left: 50%;
            top: 27px;
            display: inline-block;
            border-top: 2px solid #ffffff;
            border-left: 2px solid #ffffff;
        }
    }
}
</style>



<script>
// import '@CSS/View/_v_home'
// import HeaderNav from '@C/HeaderNav'
import { mapGetters, mapActions } from 'vuex'
import GamePlayer from '@C/../store/modules/GamePlayer/'
import ScoreBoard from '../ScoreBoard/980'

export default {
    name: 'GamePlayerTable',
    components: {
        ScoreBoard,
        PK10_BJL: r => require.ensure([], () => r(require('@C/games/PK10_BJL')), 'PK10_BJL'),
        K3_SB: r => require.ensure([], () => r(require('@C/games/K3_SB')), 'K3_SB'),
        K3_YXX: r => require.ensure([], () => r(require('@C/games/K3_YXX')), 'K3_YXX')
    },
    data() {
        return {
            is_horizontal: false,
            scrollFinish: null,
            isShowTip: true,
            touchPos: '',
            touchMovePos: ''
        }
    },
    // 加載 PIXI js 檔案
    beforeRouteEnter (to, from, next) {
        // 設定分頁標題
        const setTitle = (that) => {
            that.$i18n.setTitle(to.meta.title)
        }

        if ('PIXI' in window) {
            next(setTitle)
        } else {
            const pormiseJS = ['pixi', 'TweenMax', 'PixiPlugin'].map((js) => {
                return new Promise((resolve) => {
                    const script = document.createElement('script')
                    script.src = `${CDN}/static/pixi/js/${js}.js`
                    document.head.appendChild(script)
                    script.onload = () => resolve()
                })
            })
            Promise
                .all(pormiseJS)
                .then(() => require('pixi-projection'))
                .then(next(setTitle))
                .catch(() => console.error('PIXI or TweenMax Load fair'))
        }
    },
    created() {
        // this[_M.GET_FLIP_TIMEER]()
    },
    mounted () {
        this.isHorizontal()
        window.onresize = () => {
            this.isHorizontal()
        }
    },
    beforeMount() {
        window.onresize = null
        //lazy load store
        this.setStore({
            GamePlayer
        })
        this.timer = setInterval(() => this[_M.GET_FLIP_TIMEER](this), this.flipTimer.updateTime)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    watch: {
        $route() {
            clearInterval(this.timer)
            this.timer = setInterval(() => this[_M.GET_FLIP_TIMEER](this), this.flipTimer.updateTime)
        }
    },
    methods: {
        ...mapActions([
            _M.GET_FLIP_TIMEER
        ]),
        isHorizontal() {
            const width = document.documentElement.clientWidth
            const height = document.documentElement.clientHeight
            this.is_horizontal = width < height
        },
        getPos(e) {
            const { clientY, clientX } = e.touches[0]
            return `${~~clientY}-${~~clientX}`
        },
        handleTouchStart(e) {
            this.touchPos = this.getPos(e)
            this.touchMovePos = this.getPos(e)
        },
        handleTouchMove(e) {
            this.touchMovePos = this.getPos(e)
        },
        handleTouchEnd() {
            if (this.touchPos === this.touchMovePos) {
                this.$refs.mask.style.visibility = 'hidden'
            }
            // 如果自動撥放失效時, 撥放BGM
            this.$root.$emit('handleAutoPlayFail')
        }
    },
    props: {
        setStore: Function
    },
    computed: {
        ...mapGetters([
            'lotteryList2',
            'flipTimer',
            'messageBoxData',
            'gameLotIdYXX',
            'isMobile'
        ]),
        lotteryId() {
            return this.$route.params.lottery
        },
        gameType() {
            // 魚蝦蟹特例
            const data = this.lotteryList2[this.lotteryId]
            if (data) {
                const gameType = data.function_type || ''
                console.log('12333333333',gameType.replace('HL_', ''));
                return gameType.replace('HL_', '')
            }
            // lotteryMenu 沒該資料的話直接返回首頁
            this.$router.replace('/')
        },
        isShowCreditGameSubmitBox() {
            return this.messageBoxData[1998] ? this.messageBoxData[1998].show : false
        }
    }
}
</script>