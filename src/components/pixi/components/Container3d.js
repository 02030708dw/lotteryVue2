export default class Container3d extends PIXI.projection.Container3d {
    constructor(parent, options = {}) {
        super()
        Object.assign(this, options)
        parent.addChild(this)
    }
}