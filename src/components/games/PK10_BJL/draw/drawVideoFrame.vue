<script>
// custom skin css
import Hls from 'hls.js'
import drag from '@C/pixi/drag'
import Sprite from '@C/pixi/components/Sprite'
import { mapGetters } from 'vuex'
import { warnMessageBox } from '@UTIL'
import Graphics from '@C/pixi/components/Graphics'
import ButtonMixin from '@C/pixi/components/ButtonMixin'
import Text from '@C/pixi/components/Text'

export default {
    created() {
        // this.idle = setInterval(this.handleIdle, 1000)
        // this.noButton = setTimeout(this.handleNoButton, 1500)
        // this.stopTime = +new Date() + this.idleTime
    },
    mounted() {
        // this.setHls()
    },
    beforeDestroy() {
        this.hls && this.hls.stopLoad()
        TweenMax.killTweensOf(this.loadIcon)
        this.videoContainer && this.videoContainer.destroy({children: true})
        // clearInterval(this.idle)
        this.video && this.video.removeEventListener('loadedmetadata', this.mediaReadyEvent)
        clearTimeout(this.noButton)
    },
    data() {
        return {
            video: null,
            x: 736,
            y: 0,
            width: 465,
            height: 261,
            // videojs options
            idle: null, //計時器變數
            stopTime: 299000, //現在時間 + 299秒後
            idleTime: 299000, //299秒
            coldTime: 10, // 10秒確認是否繼續
            isPlay: true, // 是否撥放中
            isMute: true, //
            isError: false, //影片是否支援撥放
            /** video 選項 */
            hls: null,
            isFullScreen: false,
            m3u8: {
                220: 'http://sy-lott.gpilive.com/sylottable2mhls/PHSYLott02Live3/playlist.m3u8',
                221: 'http://sy-lott.gpilive.com/sylottable3mhls/PHSYLott03Live3/playlist.m3u8'
            },
            phone: {
                220: 639653071888,
                221: 639560781888
            },
            buttons: []
        }
    },
    computed: {
        ...mapGetters([
            'currentLottery'
        ])
    },
    methods: {
        getOpeningIssue() {
            return this.openingIssue
        },
        changeResolutions() {
            let options = [
                {
                    withCredentials: false,
                    type: 'application/x-mpegURL',
                    src: this.m3u8[this.lotteryId]
                }
            ]
            this.playerOptions.sources = options
        },
        handleIdle() {
            const now = +new Date()
            if ((this.stopTime - now) <= 0) {
                this.$msg(warnMessageBox({
                    type: '',
                    zIndex: 2006,
                    // 视频关闭倒数
                    message: 'common_015',
                    // 继续观看
                    confirmText: 'common_016',
                    coldTime: this.coldTime,
                    isShowCloseIcon: false,
                    isPressEscClose: false,
                    beforeCancel: () => this.toggleVideo,
                    beforeConfirm: () => {
                        this.stopTime = now + this.idleTime
                    }
                }))
            }
        },
        dragVideoContainer() {
            const p = this.videoContainer = new ButtonMixin(this.container, {
                name: 'videoContainer',
                x: this.x,
                zIndex: 98
            }, {
                up: {
                    fn: () => {
                        // 開啟按鈕
                        this.handleNoButton(true)
                        this.noButton = setTimeout(this.handleNoButton, 1500)
                    }
                }
            })

            this.videoSp = new Sprite({
                p,
                texture: PIXI.Texture.WHITE,
                width: this.width,
                height: this.height,
                tint: 0x000000
            })
            drag(p)
            this.setHls()
            this.drawLoading()
        },
        setHls() {
            const video = this.video = document.createElement('video')
            video.muted = 'muted'
            video.volume = 0
            video.setAttribute('playsinline', 'playsinline')
            video.setAttribute('webkit-playsinline', 'true')
            video.setAttribute('x5-playsinline', 'true')
            video.setAttribute('x5-video-player-type', 'h5')
            video.setAttribute('x5-video-player-fullscreen', 'false')
            video.setAttribute('x-webkit-airplay', 'allow')
            video.setAttribute('crossorigin', 'anonimous')
            video.style.display = 'none'
            // video.style.position = 'fixed'
            // video.style.top = 0
            document.body.appendChild(video)

            const isEdge = window.navigator.userAgent.includes('Edge')
            if (Hls.isSupported() && !isEdge) {
                const hls = this.hls = new Hls()
                hls.loadSource(this.m3u8[this.lotteryId])
                hls.attachMedia(video)
                hls.on(Hls.Events.MANIFEST_PARSED, this.mediaReadyEvent)
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = this.m3u8[this.lotteryId]
                video.addEventListener('loadedmetadata', this.mediaReadyEvent)
            }
        },
        mediaReadyEvent() {
            this.video.play()
            setTimeout(() => this.dragVideoBox(), 500)
        },
        dragVideoBox() {
            this.videoSp.texture = PIXI.Texture.from(this.video)
            this.videoSp.tint = 0xffffff
            //清掉一直旋轉的icon
            this.loadIcon.destroy()
            TweenMax.killTweensOf(this.loadIcon)
            this.dragVideoBar()
        },
        drawLoading() {
            const p = this.videoContainer
            const x = (p.width / 2 - 15)
            const y = (p.height / 2 - 15)
            const loadIcon = this.loadIcon = new Graphics(p, {name: 'loadIcon', x, y, anchor: {x: 0.5, y: 0.5}})
            loadIcon
                .lineStyle(5, 0xffffff, 1)
                .arc(0, 0, 30, 2 * Math.PI, 3 * Math.PI / 2)
                .endFill()
            TweenMax.to(loadIcon, 50, { rotation: 360, repeat: -1, ease: Power0.easeIn })
        },
        dragVideoBar() {
            const p = this.videoContainer
            const style = { fontFamily: 'Microsoft Yahei', fontSize: 18, fill: '#fff' }
            const telBg = new Graphics(p, {name: 'telBg', x: -10, y: 0, scale: {x: 1, y: 1}})
            const tel = new Text({ text: `${this.$t('video_001')} +${this.phone[this.lotteryId]}`, style, x: this.width - 10, y: 25, anchor: {x: 1, y: 0.5}, p: telBg })
            telBg
                .lineStyle(1, 0xf7c684)
                .beginFill(0x000000, 0.8)
                .drawRoundedRect(this.width - (tel.width + 20), 10, tel.width + 20, 30, 5)
                .endFill()

            const videoBarBg = new Graphics(p, {name: 'videoBarBg', x: 0, y: this.height - 50})
            const stepPoint = [
                {point: 0, color: 'transparent'},
                {point: 1, color: '#000000'}
            ]
            const options = {x1: 0, x2: 0, y1: 0, y2: 50, width: this.width, height: 60}
            videoBarBg
                .clear()
                .beginTextureFill(this.linearGradient(stepPoint, options))
                .drawRect(0, 0, this.width, 50)
                .endFill()

            // 關閉按鈕
            const closeIcon = new ButtonMixin(videoBarBg, {name: 'closeIcon', x: 40, y: 12}, {
                down: {
                    alpha: 0.6,
                    fn: () => {
                        this.toggleVideo()
                    }
                },
                up: {
                    up: {
                        alpha: 1
                    }
                }
            })
            const closeBg = new Graphics(closeIcon, {name: 'closeBg', anchor: {x: 0, y: 0}, x: 0, y: 0, alpha: 0.6})
            closeBg
                .beginFill(0x000000)
                .drawCircle(0, 0, 30)
                .endFill()
            const closePic = new Sprite({ id: 'video', key: 'close', anchor: {x: 0.5, y: 0.5}, x: 0, y: 0, width: 20, height: 20, p: closeIcon })

            // 靜音按鈕
            const switchIcon = new ButtonMixin(videoBarBg, {name: 'switchIcon', x: this.width / 2, y: 12}, {
                down: {
                    fn: () => {
                        if (volumeCircleDrag.x === 0) {
                            if (localStorage.getItem('volume') !== null) {
                                volumeCircleDrag.x = localStorage.getItem('volume')
                            } else {
                                volumeCircleDrag.x = 20
                            }
                            this.isMute = true
                            switchPic.setTextureKey('on')
                        } else {
                            volumeCircleDrag.x = 0
                            this.isMute = false
                            switchPic.setTextureKey('off')
                        }
                        this.video.muted = this.isMute
                    }
                }
            })
            const switchBg = new Graphics(switchIcon, {name: 'switchBg', anchor: {x: 0, y: 0}, x: 0, y: 0})
            switchBg
                .beginFill(0x000000, 0.6)
                .drawCircle(0, 0, 30)
                .endFill()
            const switchPic = new Sprite({ id: 'video', key: 'off', anchor: {x: 0.5, y: 0.5}, x: 0, y: 0, width: 25, height: 25, p: switchIcon })
            const live = new Text({ text: 'LIVE', style, x: -20, y: 0, anchor: {x: 1, y: 0.5}, alpha: 0, p: switchIcon })
            // 音量
            const volume = new Graphics(videoBarBg, {name: 'volume', alpha: 0, x: 55, y: 6, scale: {x: 0.5, y: 0.5}})
            const volumeMask = new Graphics(volume, {name: 'volumeMask', x: 0, y: 11})
            volumeMask
                .beginFill(0xffffff, 1)
                .drawRoundedRect(0, 0, 100, 4, 2)
                .endFill()
            const volumeBarDrag = new ButtonMixin(volume, {name: 'volumeBarDrag', x: 0, y: 13}, {
                up: {
                    fn: (e) => {
                        this.data = e.data
                        const newPosition = this.data.getLocalPosition(volumeBarDrag.parent)
                        volumeCircleDrag.x = newPosition.x
                    }
                }
            })
            const volumeBg = new Graphics(volumeBarDrag, {name: 'volumeBg', x: 0, y: -2})
            volumeBg
                .beginFill(0xffffff, 0.4)
                .drawRoundedRect(0, 0, 100, 4, 2)
                .endFill()
            const volumeBar = new Graphics(volume, {name: 'volumeBar', x: 0, y: 11})
            volumeBar
                .beginFill(0xffffff, 1)
                .drawRoundedRect(0, 0, 10, 4, 0)
                .endFill()
            const volumeCircleDrag = new ButtonMixin(volume, {name: 'volumeCircleDrag', x: 0, y: 13}, {
                move: {
                    fn: () => {
                        volumeBar.width = Math.floor(volumeCircleDrag.x)
                        if (volumeCircleDrag.x <= 1) {
                            volumeCircleDrag.x = 0
                            this.isMute = true
                        } else if (volumeCircleDrag.x >= 99) {
                            volumeCircleDrag.x = 100
                            this.isMute = false
                        } else {
                            volumeCircleDrag.x = volumeCircleDrag.x
                            this.isMute = false
                        }
                        const volNum = Math.floor(volumeCircleDrag.x) / 10
                        this.video.volume = volNum.toFixed(0) / 10
                        const key = this.isMute ? 'off' : 'on'
                        switchPic.setTextureKey(key)
                        this.video.muted = this.isMute
                    }
                },
                up: {
                    fn: () => {
                        localStorage.setItem('volume', Math.floor(volumeCircleDrag.x))
                    }
                },
                down: {
                    fn: () => {
                        volumeCircleDrag.x = Math.floor(volumeCircleDrag.x)
                    }
                }
            })
            const volumeCircle = new Graphics(volumeCircleDrag, {name: 'volumeCircle', x: 0, y: 0})
            volumeCircle
                .beginFill(0xffffff, 1)
                .drawCircle(0, 0, 7)
                .endFill()
            volumeBar.mask = volumeMask
            drag(volumeCircleDrag, {isY: false})

            // 全螢幕按鈕
            const screenIcon = new ButtonMixin(videoBarBg, {name: 'switchIcon', x: this.width - 40, y: 12}, {
                up: {
                    fn: () => {
                        this.isFullScreen = !this.isFullScreen
                        const key = this.isFullScreen ? 'smallScreen' : 'fullScreen'
                        screenPic.setTextureKey(key)
                        const p = this.videoContainer
                        if (this.isFullScreen) {
                            // const {x, y} = this.p.parent.toLocal(new PIXI.Point(0, 0))
                            // 全螢幕時候寬高使用initVal值, 配合resize
                            const {height: defaultH, width: defaultW, x: defalutX, y: defaultY} = this.initVal
                            p.x = defalutX
                            p.y = defaultY
                            p.width = defaultW
                            // +10 : 使視訊在全螢幕的時候微微超出, 蓋掉些許空白
                            p.height = defaultH + 10

                            telBg.scale = {x: 0.5, y: 0.5}
                            telBg.x = 226
                            screenBg.alpha = 0
                            screenIcon.scale = {x: 0.5, y: 0.5}
                            screenIcon.x = this.width - 15
                            switchBg.alpha = 0
                            switchIcon.scale = {x: 0.5, y: 0.5}
                            switchIcon.x = 40
                            live.alpha = 1
                            closeIcon.scale = {x: 0.5, y: 0.5}
                            closeIcon.y = -215
                            closeIcon.x = 20
                            closePic.scale = {x: 0.6, y: 0.6}
                            closeBg.alpha = 0.9
                            videoBarBg
                                .clear()
                                .beginFill(0x000000, 0.75)
                                .drawRect(0, 0, this.width, 25)
                                .endFill()
                            videoBarBg.y = this.height - 25
                            volume.alpha = 1
                            p.interactive = false
                            p.dragging = false
                        } else {
                            p.x = this.x
                            p.y = 0
                            p.width = this.width
                            p.height = this.height

                            telBg.scale = {x: 1, y: 1}
                            telBg.x = -10
                            screenBg.alpha = 1
                            screenIcon.scale = {x: 1, y: 1}
                            screenIcon.x = this.width - 40
                            switchBg.alpha = 1
                            switchIcon.x = this.width / 2
                            switchIcon.scale = {x: 1, y: 1}
                            live.alpha = 0
                            closeIcon.scale = {x: 1, y: 1}
                            closeIcon.y = 10
                            closeIcon.x = 40
                            closePic.scale = {x: 0.5, y: 0.5}
                            closeBg.alpha = 0.6
                            videoBarBg
                                .clear()
                                .beginTextureFill(this.linearGradient(stepPoint, options))
                                .drawRect(0, 0, this.width, 50)
                                .endFill()
                            videoBarBg.y = this.height - 50
                            volume.alpha = 0
                            p.interactive = true
                        }
                    }
                }
            })
            const screenBg = new Graphics(screenIcon, {name: 'screenBg', anchor: {x: 0, y: 0}, x: 0, y: 0})
            screenBg
                .beginFill(0x000000, 0.6)
                .drawCircle(0, 0, 30)
                .endFill()
            const screenPic = new Sprite({ id: 'video', key: 'fullScreen', anchor: {x: 0.5, y: 0.5}, x: 0, y: 0, width: 25, height: 25, p: screenIcon })

            this.buttons = [closeIcon, switchIcon, screenIcon]
        },
        // 關閉控制按鈕
        handleNoButton(isShow = true) {
            this.buttons.forEach((btn) => {
                TweenMax.to(btn, 0.5, {alpha: isShow ? 1 : 0})
            })
        }
    }
}
</script>
