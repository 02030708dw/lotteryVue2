// import * as PIXI from 'pixi.js'
import Graphics from '@C/pixi/components/Graphics'
import Text from '@C/pixi/components/Text'
import drag from '@C/pixi/drag'

export default class MutiText extends Graphics {
    constructor(objectData, styles) {
        let { text, p, x = 0, y = 0, anchor = {x: 0, y: 0.5}, ...options } = objectData
        super(p, options)
        this.styles = styles
        this.trueWidth = 0
        this.trueX = x
        this.trueY = y
        this.wordWrapWidth = styles.default.wordWrapWidth || 1000
        this.calcX = x
        this.calcY = y
        this.anchor = anchor
        this.wrapWidth = this.wordWrapWidth
        this.replaceArr = text.replace(/(<\w+>[^<>/]+<\/\w+>)/g, '**$1**').split('**')
        this.drawMutiText()
    }
    drawMutiText() {
        this.replaceArr.forEach((text) => {
            const match = text.match(/<(\w+)>([^<>/]+)<\//)
            const key = match ? match[1] : 'default'
            match && (text = match[2])
            this.drawWrap({ text, style: this.styles[key] })
        })
    }
    drawWrap({ text, style }) {
        const textSp = new Text({ text, style, x: this.calcX, y: this.calcY, anchor: this.anchor, p: this })
        let tempText = ''
        const checkWidth = () => {
            if (textSp.width > this.wrapWidth) {
                const textLength = textSp.text.length
                tempText = `${textSp.text[textLength - 1]}${tempText}`
                textSp.text = textSp.text.substr(0, textLength - 1)
                checkWidth()
            } else {
                if (tempText) {
                    this.wrapWidth = this.wordWrapWidth
                    this.trueWidth = 0
                    this.calcX = this.trueX
                    this.calcY += style.fontSize + 2
                    this.drawWrap({text: tempText, style})
                } else {
                    this.wrapWidth -= textSp.width
                    if (this.wrapWidth > style.fontSize) {
                        this.trueWidth += textSp.width
                        this.calcX += textSp.width
                    } else {
                        this.wrapWidth = this.wordWrapWidth
                        this.calcX = this.trueX
                        this.calcY += style.fontSize + 2
                    }
                }
            }
        }
        checkWidth()
    }
}