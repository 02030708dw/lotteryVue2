// import * as PIXI from 'pixi.js'
import drag from '@C/pixi/drag'

export default class AnimatedSprite extends PIXI.AnimatedSprite {
    constructor(objectData) {
        let { id, p, ...options } = objectData
        const sheet = PIXI.loadCache.resources[id]
        const textures = sheet.data.animations[id].map(key => sheet.textures[key])
        super(textures)
        options.animationSpeed = options.animationSpeed || 0.167
        Object.assign(this, options)
        p.addChild(this)
        // drag(this)
    }
}