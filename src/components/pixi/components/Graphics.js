export default class Graphics extends PIXI.Graphics {
    constructor(parent, options = {}) {
        super()
        Object.assign(this, options)
        parent.addChild(this)
    }
}