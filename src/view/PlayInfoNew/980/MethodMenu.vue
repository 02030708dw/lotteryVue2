<template>
    <div>
        <div class="playinfo_nav" :class="{ 'playinfo_nav--short': downMax >= 0 }">
            <main class="playinfo_wa">
                    <a class="playinfo_nav_prev" v-if="downMax < 0 && navNum < 0" @click="navMove('up',5)"></a>
                    <a class="playinfo_nav_next" v-if="downMax < 0 && navNum > downMax" @click="navMove('down',5)"></a>
                    <div ref="navMenu">
                        <ul :style="cssPrefix">
                            <!-- <li :class="{ 'active': activeKey === '' }" @click="handleMenuClick()">{{$t('销售时间')}}</li> -->
                            <template>
                                <li
                                    v-for="(method, key) in list"
                                    :key="key"
                                    :class="{ 'active': menuActive(key) }"
                                    @click="handleMenuClick(key)"
                                >
                                    <pre><span>{{$t(method.title_key)}}</span></pre>
                                </li>
                            </template>
                        </ul>
                    </div>
            </main>
        </div>
        <transition name='playinfo_gotop-'>
            <div class="playinfo_gotop"
                :class="{ 'playinfo_gotop--rocket' : rocketFireOn }"
                v-if="showTopButton"
                @click="scrollToTop(true)"
            >TOP</div>
        </transition>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import { mapGetters } from 'vuex'
import smoothscroll from 'smoothscroll-polyfill'

export default {
    name: 'MethodMenu',
    created () {
        this.addListener()

        // requestAnimationFrame polyfill for IE9
        // https://gist.github.com/paulirish/1579671
        let lastTime = 0
        let vendors = ['ms', 'moz', 'webkit', 'o']
        for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                window[vendors[x] + 'CancelRequestAnimationFrame']
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = (callback) => {
                let currTime = new Date().getTime()
                let timeToCall = Math.max(0, 16 - (currTime - lastTime))
                let id = window.setTimeout(() => {
                    callback(currTime + timeToCall)
                }, timeToCall)
                lastTime = currTime + timeToCall
                return id
            }
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = (id) => {
                clearTimeout(id)
            }
        }

        // smoothscroll
        smoothscroll.polyfill()
    },
    destroyed () {
        this.removeListener()
    },
    data() {
        return {
            activeKey: '',
            navNum: 0,
            showTopButton: false,
            clickKey: '',
            scrollFinish: null,
            rocketFireOn: false,
            oneStep: 47,
            downMax: 0
        }
    },
    mounted () {
        this.updateDownMax()
    },
    updated() {
        this.updateDownMax()
    },
    watch: {
        playListIndex() {
            this.activeKey = ''
            this.navNum = 0
        }
    },
    computed: {
        ...mapGetters([
            'getMenuId',
            'playList',
            'playListIndex',
            'isMobile',
            'isW88'
        ]),
        cssPrefix() {
            const cssStyle = `-webkit-transform: translateY(${this.navNum}px);
                -moz-transform: translateY(${this.navNum}px);
                -ms-transform: translateY(${this.navNum}px);
                -o-transform: translateY(${this.navNum}px);
                transform: translateY(${this.navNum}px);`

            return cssStyle
        },
        oneLotList() {
            return this.playList[this.playListIndex]
        },
        list() {
            // 初次進入的資料處理
            return this.playList ? this.oneLotList : {}
        }
    },
    methods: {
        addListener() {
            window.addEventListener('resize', this.handleResize)
            window.addEventListener('keydown', this.stopEvent)
            window.addEventListener('keypress', this.stopEvent)
            window.addEventListener('keyup', this.stopEvent)
            window.addEventListener('wheel', this.stopEvent)
            // 320 有用到拿來覆蓋
            this.addScrollListener()
        },
        removeListener() {
            window.removeEventListener('resize', this.handleResize)
            window.removeEventListener('keydown', this.stopEvent)
            window.removeEventListener('keypress', this.stopEvent)
            window.removeEventListener('keyup', this.stopEvent)
            window.removeEventListener('wheel', this.stopEvent)
            this.removeScrollListener()
        },
        addScrollListener () {
            window.addEventListener('scroll', this.handleScroll)
        },
        removeScrollListener () {
            window.removeEventListener('scroll', this.handleScroll)
        },
        scrollToTop(rocketFireOn = false) {
            let nowScrollY = document.documentElement.scrollTop || document.body.scrollTop
            if (nowScrollY !== 0) {
                // W88 沒有最頂那列
                if (this.isW88) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                } else {
                    const sinMenu = this.$parent.$children[1].$el
                    sinMenu.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end'
                    })
                }

                rocketFireOn && (this.rocketFireOn = true)
            }
        },
        scrollToElement(el) {
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        },
        handleMenuClick(key) {
            this.rocketFireOn = false

            if (key) {
                //scroll to element
                const navNameArray = Object.keys(this.oneLotList)
                const cardArr = document.querySelectorAll('.playinfo_rules>li')
                const el = cardArr[navNameArray.indexOf(key)]

                this.scrollToElement(el)
            } else {
                //销售时间
                this.scrollToTop(false)
            }

            //record active
            this.clickKey = key || ''

            // 拉到最底下時候
            clearTimeout(this.scrollFinish)
            this.scrollFinish = setTimeout(() => {
                if (this.clickKey !== '') {
                    this.activeKey = this.clickKey
                    this.clickKey = ''
                }
            }, 200)
        },
        updateDownMax() {
            if (!this.playList || !this.oneLotList) return
            const navMenuHeight = this.$refs.navMenu.offsetHeight
            const ulHeight = this.$refs.navMenu.childNodes[0].offsetHeight
            this.downMax = (-1 * ulHeight) + navMenuHeight
        },
        navMove(move, stepNumber = 1) {
            const step = (stepNumber > 0) ? this.oneStep * stepNumber : this.oneStep

            // 可以往上
            if (move === 'up' && this.navNum < 0) {
                if (this.navNum + step > 0) {
                    this.navNum = 0
                    return
                }
                this.navNum += step
            }

            // update downMax
            this.updateDownMax()
            // 可以往下
            if (move === 'down' && this.navNum > this.downMax) {
                const remainSpace = this.downMax - this.navNum
                if (remainSpace > -step) {
                    this.navNum += remainSpace
                    return
                }
                this.navNum += -step
            }
        },
        handleScroll () {
            const navNameArray = Object.keys(this.oneLotList)
            const cardArr = document.querySelectorAll('.playinfo_rules>li')
            const WindowHeight = window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight
            const MARK_LINE = parseInt(WindowHeight / 2)

            let gameIndex = 0
            let elKey = navNameArray.find(() => {
                return cardArr[gameIndex++].getBoundingClientRect().top > MARK_LINE
            })

            // controll method_menu to scroll auto
            const oldKeyIndex = navNameArray.indexOf(this.activeKey)
            const newKeyIndex = (elKey !== undefined) ? navNameArray.indexOf(elKey) - 1 : navNameArray.length - 1

            if (newKeyIndex > 0) {
                if (newKeyIndex > oldKeyIndex) {
                    // 向下滾動
                    this.navMove('down', 1)
                } else if (newKeyIndex < oldKeyIndex) {
                    // 向上滾動
                    this.navMove('up', 1)
                }
                this.activeKey = navNameArray[newKeyIndex]
            } else {
                this.activeKey = ''
            }

            // when scroll finished,  activeKey point to clickKey
            clearTimeout(this.scrollFinish)
            this.scrollFinish = setTimeout(() => {
                if (this.clickKey !== '') {
                    this.activeKey = this.clickKey
                    this.clickKey = ''
                }
            }, 200)

            // top button reset
            const nowScrollY = document.documentElement.scrollTop || document.body.scrollTop
            if (nowScrollY === 0) {
                this.showTopButton = false
                this.activeKey = ''
                this.clickKey = ''
                this.navNum = 0
                this.rocketFireOn = false
                return
            }
            this.showTopButton = true
            this.nowScrollY = nowScrollY
        },
        handleResize () {
            this.updateDownMax()
        },
        menuActive(menuItemIndex) {
            const firstItem = Object.keys(this.oneLotList)[0]
            if (menuItemIndex === firstItem && this.activeKey === '') {
                return true
            }
            return this.activeKey === menuItemIndex
        },
        stopEvent(e) {
            // 火箭正飛行時,停止(滾輪&鍵盤)事件
            this.rocketFireOn && e.preventDefault()
        }
    }
}
</script>