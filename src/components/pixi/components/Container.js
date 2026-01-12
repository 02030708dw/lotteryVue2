export default class Container extends PIXI.Container {
    constructor(parent, options = {}) {
        super()
        Object.assign(this, options)
        parent.addChild(this)
    }
}