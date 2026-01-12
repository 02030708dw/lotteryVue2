export default class Container2d extends PIXI.projection.Container2d {
    constructor(parent, options = {}) {
        super()
        Object.assign(this, options)
        parent.addChild(this)
    }
}