import viewport from 'pixi-viewport'
export default class Viewport extends viewport {
    constructor(parent, options = {}) {
        super(options)
        // Object.assign(this, options)
        parent.addChild(this)
    }
}