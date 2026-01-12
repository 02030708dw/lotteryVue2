// import * as PIXI from 'pixi.js'
export default class DarkenFitler extends PIXI.filters.ColorMatrixFilter {
    constructor() {
        super()
        const colorMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
        this.matrix = colorMatrix
    }
}
