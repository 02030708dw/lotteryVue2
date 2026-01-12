// import * as PIXI from 'pixi.js'

export default class DarkenFitler extends PIXI.filters.BlurFilter {
    constructor(options) {
        super()
        Object.assign(this, options)
    }
}
