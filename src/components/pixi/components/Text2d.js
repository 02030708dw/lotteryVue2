// import * as PIXI from 'pixi.js'
import drag from '@C/pixi/drag'

export default class Text2d extends PIXI.projection.Text2d {
    constructor(objectData) {
        const { text, style, p, anchor = {x: 0.5, y: 0.5}, resolution = 2, ...options } = objectData
        super(text, style)
        this.objectData = objectData
        Object.assign(this, { anchor, resolution }, options)
        // drag(this)
        try {
            p.addChild(this)
            this.parent.text = this
        } catch (err) {
            console.error('you need set parents', this)
        }
    }
}