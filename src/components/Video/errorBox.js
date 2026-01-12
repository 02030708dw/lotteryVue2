// Get the Component base class from Video.js
import _videojs from 'video.js'
import i18n from '../../lang/lang'

const videojs = window.videojs || _videojs
const Component = videojs.getComponent('Component')

export default class errorBox extends Component {
    constructor(player, options) {
        super(player, options)
    }
    createEl() {
        const {
            message
        } = this.options_

        const div = videojs.dom.createEl('div', {
            className: 'gr_video__errorbox'
        })
        div.innerHTML = '<div class="gr_errorbox__message">' + i18n.t(message) + '</div>'

        return div
    }

}
