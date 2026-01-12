// Get the Component base class from Video.js
import _videojs from 'video.js'
import i18n from '../../lang/lang'
const videojs = window.videojs || _videojs
const Button = videojs.getComponent('Button')

export default class Live extends Button {
    constructor(player, options) {
        super(player, options)
        this.updateTextContent(options.text)
    }
    createEl() {
        return videojs.dom.createEl('button', {
            className: 'vjs-live vjs-control'
        })
    }
    updateTextContent(text) {
        if (typeof text !== 'string') {
            // 直播
            text = i18n.t('common_126')
        }
        videojs.dom.emptyEl(this.el())
        videojs.dom.appendContent(this.el(), text)
    }
}
