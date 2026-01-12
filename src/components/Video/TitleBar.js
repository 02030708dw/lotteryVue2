// Get the Component base class from Video.js
import _videojs from 'video.js'
import i18n from '../../lang/lang'
const videojs = window.videojs || _videojs
const Component = videojs.getComponent('Component')

export default class TitleBar extends Component {
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
        const div = videojs.dom.createEl('div', {
            className: 'gr_video__header'
        })
        if (isError) {
            if (!isMobile) {
                // '视频需要安装{0}套件才可以观看'
                const errTxt = i18n.t('common_127', {'0': ' <a href="http://www.adobe.com/go/getflashplayer" target="_blank">Adobe Flash </a>'})
                div.innerHTML = `<p>${errTxt}</p>`
            }
        } else {
            const leftDivBg = document.createElement('div')
            leftDivBg.className = `vjs-openissue lottery_${lotteryId}`
            this.openLotteryName = document.createElement('p') // 彩種名
            this.openIssueText = document.createElement('p') // 獎期
            this.openPhone = document.createElement('p') // 電話
            // 第{0}期
            // this.openIssueText.innerHTML = i18n.t('common_001', {'0': getOpeningIssue()})
            let lotteryKey
            let lotteryPhone
            switch (lotteryId) {
                // 1分彩
                case '142':
                case '153':
                    lotteryKey = i18n.t('video_002')
                    lotteryPhone = `${i18n.t('video_001')}+639653071888`
                    break
                // 1.5分彩
                case '143':
                case '154':
                    lotteryKey = i18n.t('video_003')
                    lotteryPhone = `${i18n.t('video_001')}+639560781888`
                    break
                // 1.5分4D彩
                case '155':
                case '156':
                    lotteryKey = i18n.t('video_004')
                    lotteryPhone = `${i18n.t('video_001')}+639558257888`
                    break
                // 1.5分11选5 Live1
                case '233':
                case '234':
                    lotteryKey = `${i18n.t('video_005')} <span>Live1</span>`
                    lotteryPhone = `${i18n.t('video_001')}+639558121888`
                    break
                // 1.5分11选5 Live2
                case '235':
                case '236':
                    lotteryKey = `${i18n.t('video_005')} <span>Live2</span>`
                    lotteryPhone = `${i18n.t('video_001')}+639975193888`
                    break
                // 1.5分PK10
                case '230':
                case '231':
                case '232':
                    lotteryKey = i18n.t('video_006')
                    lotteryPhone = `${i18n.t('video_001')}+639655617888`
                    break
            }
            this.openLotteryName.innerHTML = lotteryKey
            this.openIssueText.innerHTML = `#${getOpeningIssue()}`
            this.openPhone.innerHTML = lotteryPhone
            leftDivBg.appendChild(this.openLotteryName)
            leftDivBg.appendChild(this.openIssueText)
            const rightDivBg = document.createElement('div')
            rightDivBg.className = `vjs-phone lottery_${lotteryId}`
            rightDivBg.appendChild(this.openPhone)
            div.appendChild(leftDivBg)
            div.appendChild(rightDivBg)
        }
        return div
    }
    updateOpeningIssue() {
        const {
            isError,
            getOpeningIssue
        } = this.options_
        if (isError) {
            return
        }
        setTimeout(() => {
            // 第{0}期
            // this.openIssueText.innerHTML = i18n.t('common_001', {'0': getOpeningIssue()})
            this.openIssueText.innerHTML = `#${getOpeningIssue()}`
        }, 300)
    }
}
