<template>
    <div
        :class="[className, classLang, classTablePlayer, {'unsetOverflow': isRoute === 'SalesTime'}]"
        @click="closePopActive"
    >
        <router-view :setStore="setStore" />
        <DirectNav v-if="isShowDirectNav" />
        <OutGameMask v-if="isOutGame" />
        <MessageBox
            :zIndex="1994"
            className="el-news-message-box"
        >
            <InfoMationBox />
        </MessageBox>
        <MessageBox :zIndex="2000" />
        <MessageBox :zIndex="2004" />
        <MaskScreen v-if="maskQueue.length > 0" />
        <!-- <Monitor :root="$store.getters" /> -->
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Observable } from 'rxjs/Observable'
import { getCookie, checkLoginMessageBox } from '@UTIL'
import InfoMationBox from '@C/InfoMationBox'
import MaskScreen from '@C/MaskScreen'
import DirectNav from '@C/games/DirectNav'
import OutGameMask from '@C/OutGameMask'
// import Monitor from "@C/Monitor"
export default {
    name: 'app',
    components: {
        MaskScreen,
        InfoMationBox,
        DirectNav,
        OutGameMask
        // Monitor,
    },
    mounted() {
        this.checkJWT(false) && this[_M.APP_INIT](this) // check if logged in
        window.addEventListener('keydown', (e) => {
            if (e.keyCode === 27 && this.maskQueue.length > 0) {
                this.maskQueue[0].isPressEscClose && this.$store.dispatch(this.maskQueue[0].action, this.maskQueue[0].zIndex)
            }
        }, false)
        // 預防 @click.stop="closePopActive" 的 div 不夠長，故保留 window.addEventListener
        window.addEventListener('click', this.closePopActive)
    },
    beforeDestroy () {
        window.removeEventListener('click', this.closePopActive)
    },
    data() {
        return {
            idleTimer: 0,
            maxIdleTimer: 1800
        }
    },
    subscriptions() {
        const mouseMove = Observable.fromEvent(window, 'mousemove')
        const touchMove = Observable.fromEvent(window, 'touchmove')
        const touchStart = Observable.fromEvent(window, 'touchstart')
        return {
            RWD$: Observable
                .fromEvent(window, 'resize')
                .bufferTime(150)
                .filter(val => val.length > 0)
                .map(val => val[val.length - 1].target.innerWidth)
                .map(this.handleResize)
                .filter(mode => mode !== this.RWD$)
                .do(this[_M.SET_RWD_MODE]),
            route$: this.$watchAsObservable('$route')
                .pluck('newValue', 'name')
                .do(this.handle320NavIndex)
                .filter(() => this.hamburgar)
                .do(() => this[_M.SET_HAMBURGAR](false)),
            /** 閒置歸0 */
            idleStopEvent$: mouseMove
                .merge(touchMove)
                .merge(touchStart)
                .do(() => (this.idleTimer = 0)),
            /** 每 10 秒CheckJWT */
            JWT$: Observable
                .interval(10000)
                .do(() => this.checkJWT(true)),
            /** 每 90 秒更新一次餘額 */
            /** idle 時間計算 */
            oneSecondTimer$: Observable
                .interval(1000)
                .do(this.handleIdleTimer)
                .do(this[_M.GET_WALLET_BALANCE])
            /** 每 5分鐘 檢查Menu是否封盤 */
            /*
            menu$: Observable
                // .interval(300000)
                .interval(5000)
                .do(() => this.checkMenu())
            */
        }
    },
    methods: {
        ...mapActions([
            _M.SET_RWD_MODE,
            _M.GET_WALLET_BALANCE,
            _M.SET_HAMBURGAR,
            _M.SET_HEADER_NAV_ACTIVE_NAME,
            _M.APP_INIT,
            _M.SET_IS_IDLE,
            _M.SET_POP_ACTIVE,
            _M.GET_LOTTERY_LIST
        ]),
        handleResize(width) {
            let mode = 1
            // if (width > 767 && width <= 979) {
            //     mode = 2
            // } else if (width < 768) {
            //     mode = 3
            // }
            if (width < 980) {
                mode = 3
            }
            return mode
        },
        // check dup login
        checkJWT(shouldDisplayMsg) {
            // don't check if already at Redirect page
            if (window.location.pathname === '/Redirect' ||
                window.location.hash === '#/Redirect' //for IE9 compatibility
            ) return
            let JWT = getCookie('JWT')
            if ((JWT && JWT !== this.JWTHash) || !JWT) {
                if (shouldDisplayMsg) {
                    const message = this.$t(!JWT && this.isDemo
                        // 您的试玩时间已结束，欢迎您加入。
                        ? 'popup_066'
                        // 您的账号已重复登入，此页面已被登出。
                        : 'popup_088')
                    const getters = {
                        userInfo: this.userInfo,
                        isGPI: this.isGPI,
                        isDirect: this.isDirect,
                        miscInfo: this.miscInfo
                    }
                    this.$msg(checkLoginMessageBox({message}, getters))
                } else {
                    this.$router.replace('Redirect')
                }
                return false
            }
            return true
        },
        handle320NavIndex(name) {
            const activeName = name === 'GamePlayer' ? 'second' : 'first'
            this[_M.SET_HEADER_NAV_ACTIVE_NAME](activeName)
        },
        handleIdleTimer() {
            this.idleTimer === this.maxIdleTimer ? this[_M.SET_IS_IDLE](true) : this.idleTimer++
        },
        setStore(storeObj) {
            Object.keys(storeObj).forEach((name) => {
                if (!this.$store._modules.root.getChild(name)) {
                    this.$store.registerModule(name, storeObj[name])
                }
            })
        },
        closePopActive() {
            this[_M.SET_POP_ACTIVE]()
        }
        /*
        checkMenu() {
            console.log('檢查Menu:', this.isDev)
            this.isDev && this[_M.GET_LOTTERY_LIST](true)
        }
        */
    },
    computed: {
        ...mapGetters([
            'hamburgar',
            'RWDMode',
            'JWTHash',
            'maskQueue',
            'lang',
            'JWT',
            'isDemo',
            'isDev',
            'userInfo',
            'isGPI',
            'miscInfo',
            'isDirect',
            'isShowDirectNav',
            'getMenuId',
            'isTest',
            'isOutGame'
        ]),
        className() {
            if (this.hamburgar && this.RWDMode > 1) {
                return 'is_hamburger-active'
            }
            return ''
        },
        classLang() {
            return 'lang_' + this.lang
        },
        classTablePlayer() {
            if (this.$route.name === 'GamePlayerTable') {
                return 'table_player'
            }
            return ''
        },
        isRoute() {
            return this.$route.name
        }
    }
}
</script>