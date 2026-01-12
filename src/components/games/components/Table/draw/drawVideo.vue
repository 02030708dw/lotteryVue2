<script>
import Button from '@C/pixi/components/Button'
import Container from '@C/pixi/components/Container'
// import * as PIXI from 'pixi.js'

export default {
    name: 'drawVideo',
    beforeMount() {
        this.drawFnFlow.push(
            this.dragVideoBtn
        )
        this.resourceArr.push(
            { id: 'video', file: 'sp.json', urlPath: `${CDN}/static/pixi/share/video/` }
        )
    },
    beforeDestroy() {
    },
    methods: {
        dragVideoBtn() {
            // ios 有問題先不開放
            if (PIXI.utils.isMobile.apple.device) {
                return
            }
            const p = new Container(this.container, {name: 'Video'})
            if (this.isHL) {
                const videoBtn = new Button({ id: 'btn', key: 'video', x: 1200, y: 185, p }, {
                    down: { textureID: 'videoc' },
                    up: {
                        textureID: 'video',
                        fn: this.toggleVideo
                    },
                    out: {textureID: 'video'}
                })
            }
        },
        toggleVideo() {
            this.isShowVideo = !this.isShowVideo
            if (this.isShowVideo) {
                this.dragVideoContainer()
            } else {
                this.hls && this.hls.stopLoad()
                TweenMax.killTweensOf(this.loadIcon)
                this.videoContainer.destroy({children: true})
                // clearInterval(this.idle)
                this.video.removeEventListener('loadedmetadata', this.mediaReadyEvent)
                document.body.removeChild(this.video)
                clearTimeout(this.noButton)
            }
        }
    }
}
</script>