<template>
    <div
        class="gy_game_tools"
        :class="{'hide': is_hide}"
        ref="tools"
        :style="{
            left: dragX + 'px',
            top: dragY + 'px'
        }"
    >
        <div class="gy_game_content" :style="{backgroundColor: `#${this.color}`}">
            <ul>
            <li @click="linkHome">
                <svg viewBox="0 0 40 40">
                <path
                    d="M38.6,16.4l-18-13.2c-0.3-0.3-0.8-0.3-1.2,0l-18,13.2c-0.4,0.3-0.5,0.9-0.2,1.4c0.3,0.4,0.9,0.5,1.4,0.2l2.6-1.9v19.8c0,0.5,0.4,1,1,1h9.9c0.5,0,0.9-0.4,1-0.9c0,0,0,0,0-0.1v-9.6c0-1.6,1.3-3,3-3s3,1.3,3,3v9.6c0,0,0,0.1,0,0.1
                                c0,0.5,0.5,0.9,1,0.9h9.9c0.5,0,1-0.4,1-1V16.1l2.6,1.9c0.2,0.1,0.4,0.2,0.6,0.2c0.3,0,0.6-0.1,0.8-0.4C39.1,17.4,39,16.8,38.6,16.4z"
                    class="st1"
                />
                </svg>
                <span>{{$t('home_064')}}</span>
            </li>
            <li @click="linkChat">
                <svg viewBox="0 0 40 40">
                    <path
                        d="M24.8,26.4C23.5,27.5,22,28,20,28.1h-0.1c-2,0-3.5-0.6-4.7-1.6c-4.1,0.9-7.8,3.1-10.4,6C8.6,36.5,14,39,20,39c6,0,11.4-2.5,15.2-6.6C32.6,29.5,28.9,27.4,24.8,26.4z"
                        class="st1"
                    />
                    <path
                        d="M20.2,8.7c2,0,5.5,0.9,5.7,6.8v0v0.2l0,0.1c0.2,1.7,0.1,6.8-1.9,9.6l0,0l-0.6,0.2c-0.6,0.3-1.8,0.4-3.1,0.4c-1.5,0-3-0.2-4.1-0.5l-0.4-0.1c-1.8-2.4-2.2-6.7-1.9-9.7l0-0.1v-0.1v0c0.3-5.9,3.7-6.8,5.7-6.8H20.2 M20.2,6.7h-0.4
                                            c-1.7,0-7.4,0.6-7.7,8.7v0.1c0,0.1-0.7,7.5,2.6,11.5c0.2,0.2,0.4,0.4,0.6,0.6c0.2,0,0.4-0.1,0.5-0.1c1.2,0.4,3,0.6,4.6,0.6c1.5,0,2.9-0.2,3.9-0.6c0.2,0,0.4,0.1,0.5,0.1c0.2-0.2,0.4-0.4,0.6-0.6c3.3-3.9,2.6-11.4,2.6-11.5v-0.1
                                            C27.6,7.3,21.9,6.7,20.2,6.7L20.2,6.7z"
                        class="st1"
                    />
                    <path
                        d="M10,12.4C10,12.4,10,12.3,10,12.4c0-5.9,4-9.7,10-9.7s10,3.9,10,9.7c0,0,0,0,0,0.1h1.7c0,0,0,0,0-0.1C31.7,5.6,26.9,1,20,1C13.1,1,8.3,5.6,8.3,12.3c0,0,0,0,0,0.1H10z"
                        class="st1"
                    />
                    <path
                        d="M29.6,17.3h3.8c0.3,0,0.5-0.2,0.5-0.5v-6.4c0-0.3-0.2-0.5-0.5-0.5h-3.8c-0.1,0-0.2,0.1-0.2,0.2v7C29.5,17.3,29.5,17.3,29.6,17.3z"
                        class="st1"
                    />
                    <path
                        d="M10.4,17.3H6.6c-0.3,0-0.5-0.2-0.5-0.5v-6.4c0-0.3,0.2-0.5,0.5-0.5h3.8c0.1,0,0.2,0.1,0.2,0.2v7C10.5,17.3,10.5,17.3,10.4,17.3z"
                        class="st1"
                    />
                    <ellipse cx="21.5" cy="20.3" rx="2.4" ry="1.7" class="st1" />
                    <path
                        d="M23.5,20.8c0,0,0.1-0.2,0.1-0.6c0-0.3-0.2-0.6-0.2-0.6l4.2-0.2c1,0,2-0.6,2.4-1.6l0.2-0.4h1.4l-0.5,1c-0.7,1.3-2,2.2-3.5,2.2L23.5,20.8z"
                        class="st1"
                    />
                </svg>
                <span>{{$t('Glory_0020')}}</span>
            </li>
            </ul>
        </div>
        <div
            class="gy_game_switch"
            :style="{backgroundColor: `#${this.color}`}"
            @mousedown.stop="handleDrag"
            @touchstart.stop="handleDrag"
            @mouseup.stop="handleDrop"
            @touchend.stop="handleDrop"
        >
            <svg viewBox="0 0 14 23">
            <path
                id="Back_15_"
                d="M3,22.4l10.1-9.7c0.7-0.7,0.7-1.8,0-2.5L3,0.6C2.4,0,1.5,0,0.9,0.6l0,0C0.2,1.3,0.2,2.4,0.9,3l8.8,8.5L0.9,20c-0.7,0.7-0.7,1.8,0,2.5l0,0C1.5,23,2.4,23,3,22.4z"
                class="st0"
            ></path>
            </svg>
        </div>
    </div>
</template>
<style lang="scss">
$primary:#E0832B;
$base_invert: #fff;
.gy_game_content {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: $primary;
    display: inline-block;
    vertical-align: middle;
    ul {
        padding: 10px;
        li + li {
            margin-top: 10px;
        }
    }
    span {
        font-size: 12px;
        color: $base_invert;
    }
    svg {
        display: block;
        width: 24px;
        height: 24px;
        fill: $base_invert;
    }
}
.gy_game_tools {
    position: fixed;
    // bottom: 25%;
    // left: 0;
    z-index: 99999;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    // transition: all .2s ease;
    vertical-align: middle;
    &.hide {
        left: -44px;
        // transition: all .2s ease;
        .gy_game_switch svg {
            transform: translateY(-50%) rotate(0deg);
            transition: all .2s ease;
        }
    }
}
.gy_game_switch {
    position: relative;
    width: 26px;
    height: 50px;
    left: -4px \9;
    text-align: center;
    background-color: $primary;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    display: inline-block;
    vertical-align: middle;
    svg {
        width: 12px;
        fill: $base_invert;
        position: relative;
        top: 50%;
        transform: translateY(-50%) rotate(180deg);
        transition: all .2s ease;
    }
}
</style>
<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'DirectNav',
        data() {
            const dragX = -44
            const dragY = Math.max(window.innerHeight * 0.7, 110)
            return {
                is_hide: true,
                dragX,
                dragY,
                prevX: 0,
                prevY: 0,
                // x: 0,
                y: 0,
                scrollTop: 0,
                scrollWidth: 0,
                checkTime: 0,
                isCanMove: false,
                timer: null
            }
        },
        mounted() {
            window.addEventListener('resize', this.handleResize)
        },
        beforeDestroy() {
            clearTimeout(this.timer)
            window.removeEventListener('resize', this.handleResize)
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'isOutGame'
            ]),
            color() {
                return this.userInfo.color || ''
            },
            home() {
                return this.userInfo.home || ''
            },
            chat() {
                return this.userInfo.chat || ''
            },
            isExternal() {
                return this.chat.indexOf(this.home) === -1
            }
        },
        methods: {
            ...mapActions([
                _M.SET_IS_OUT_GAME
            ]),
            addListener() {
                this.addMoveListener()
            },
            removeListener() {
                this.removeMoveListener()
            },
            addMoveListener() {
                this.isCanMove = true
                window.addEventListener('mousemove', this.handleMove)
                window.addEventListener('touchmove', this.handleMove)
                window.addEventListener('mouseup', this.removeListener)
                window.addEventListener('touchend', this.removeListener)
            },
            removeMoveListener() {
                this.isCanMove = false
                clearTimeout(this.timer)
                window.removeEventListener('mousemove', this.handleMove)
                window.removeEventListener('touchmove', this.handleMove)
                window.removeEventListener('mouseup', this.removeListener)
                window.removeEventListener('touchend', this.removeListener)
            },
            handleResize() {
                this.dragY = Math.max(Math.min(window.innerHeight - 110, this.dragY), 0)
            },
            handleDrag(e) {
                e.preventDefault()
                this.checkTime = +new Date()
                // const { offsetLeft, offsetTop } = this.$refs.tools
                const { offsetTop } = this.$refs.tools
                // this.x = e.pageX || e.touches[0].pageX
                this.y = e.pageY || e.touches[0].pageY
                // this.prevX = this.x - offsetLeft
                this.prevY = this.y - offsetTop
                this.scrollTop = window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0
                this.scrollWidth = document.body.scrollWidth ||
                document.documentElement.scrollWidth
                clearTimeout(this.timer)
                this.timer = setTimeout(this.addListener, 100)
            },
            handleMove(e) {
                // const { width, height } = this.$refs.tools.getBoundingClientRect()
                const { height } = this.$refs.tools.getBoundingClientRect()
                // this.x = e.pageX || e.touches[0].pageX
                this.y = e.pageY || e.touches[0].pageY
                // this.dragX = Math.min(Math.max(this.x - this.prevX, -44), this.scrollWidth - width)
                this.dragY = Math.min(Math.max(this.y - this.prevY, 0), window.innerHeight - height)
            },
            handleDrop() {
                if (!this.isCanMove) {
                    this.is_hide = !this.is_hide
                    this.dragX = this.is_hide ? -44 : 0
                }
                this.removeListener()
            },
            linkChat() {
                if (!this.isOutGame) {
                    if (this.isExternal) {
                        window.open(this.chat, '_blank')
                    } else {
                        this[_M.SET_IS_OUT_GAME](true)
                        location.href = this.chat
                    }
                }
            },
            linkHome() {
                if (!this.isOutGame) {
                    this[_M.SET_IS_OUT_GAME](true)
                    location.href = this.home
                }
            }
        }
    }
</script>
