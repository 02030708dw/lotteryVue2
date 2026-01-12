export default class Camera3d extends PIXI.projection.Camera3d {
    constructor(parent, options = {}) {
        super()
        Object.assign(this, options)
        parent.addChild(this)
    }
}