// Get the Component base class from Video.js
import _videojs from 'video.js'
import i18n from '../../lang/lang'
const videojs = window.videojs || _videojs
const Component = videojs.getComponent('Component')

export default class VNTitleBar extends Component {
    constructor(player, options) {
        super(player, options)
        this.on(player, 'updateOpeningIssue', this.updateOpeningIssue)
    }
    createEl() {
        const {
            isError,
            getOpeningIssue,
            lotteryId,
            isMobile
        } = this.options_
        this.width = 930
        this.height = 522
        const canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.style.position = 'absolute'
        canvas.style.zIndex = 2

        this.ctx = canvas.getContext('2d')

        if (isError) {
            if (!isMobile) {
                // '视频需要安装{0}套件才可以观看'
                const errTxt = i18n.t('common_127', {'0': ' <a href="http://www.adobe.com/go/getflashplayer" target="_blank">Adobe Flash </a>'})
                // div.innerHTML = `<p>${errTxt}</p>`
            }
        } else {
            this.renderCanvas(getOpeningIssue)
        }
        return canvas
    }
    updateOpeningIssue() {
        const {
            isError,
            getOpeningIssue
        } = this.options_
        if (isError) {
            return
        }
        this.renderCanvas(getOpeningIssue)
        // setTimeout(() => {
        // // 第{0}期
        //   this.openIssueText.innerHTML = i18n.t('common_001', {'0': getOpeningIssue()})
        // }, 300)
    }
    renderCanvas(getOpeningIssue) {
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.renderTitle(getOpeningIssue)
        this.renderTitle2(getOpeningIssue)
    }
    renderTitle(getOpeningIssue, width = 300, height = 150) {
        const left = (this.width / 2) - (width / 2)
        this.ctx.fillStyle = '#000'
        this.ctx.fillRect(left, 0, width, height)
        this.ctx.font = `12pt Arial`
        this.ctx.fillStyle = '#e6e6e6'
        this.ctx.fillText(i18n.t('common_001', {'0': getOpeningIssue()}), left, 50)
    }
    renderTitle2(getOpeningIssue, width = 300, height = 50) {
        const left = this.width - 100
        const top = 300
        this.ctx.fillStyle = '#000'
        this.ctx.fillRect(left, top, width, height)
        this.ctx.font = `12pt Arial`
        this.ctx.fillStyle = '#e6e6e6'
        this.ctx.fillText(i18n.t('common_001', {'0': getOpeningIssue()}), left, top + 50)
    }
}
