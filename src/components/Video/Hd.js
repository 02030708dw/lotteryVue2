// Get the Component base class from Video.js
import _videojs from 'video.js'
const videojs = window.videojs || _videojs
const Button = videojs.getComponent('Button')

export default class Tools extends Button {
    constructor(player, options) {
        super(player, options)
        this.isHd = options.isHd
        this.changeResolutions = options.changeResolutions
        this.updateTextContent()
    }
    createEl() {
        return videojs.dom.createEl('button', {
            className: 'vjs-hd-control vjs-control vjs-button'
        })
    }
    handleClick() {
        // this.changeResolutions(!this.isHd)
    }
    updateTextContent(text) {
        if (typeof text !== 'string') {
            text = 'HD'
            // text = this.isHd ? '高解析' : '低解析'
        }
        videojs.dom.emptyEl(this.el())
        videojs.dom.appendContent(this.el(), text)
    }
}
