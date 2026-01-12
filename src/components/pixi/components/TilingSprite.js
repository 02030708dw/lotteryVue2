// import * as PIXI from 'pixi.js'
import drag from '@C/pixi/drag'

export default class TilingSprite extends PIXI.TilingSprite {
    constructor(objectData) {
        let { id, key, p, texture, ...options } = objectData
        texture = texture || PIXI.loadCache.resources[id].texture || PIXI.loadCache.resources[id].textures[key]
        let name
        if (key) {
            name = key
        } else {
            name = id
        }
        super(texture)
        this.res = PIXI.loadCache.resources[id]
        this.name = name
        this.objectData = objectData
        Object.assign(this, options)
        try {
            p.addChild(this)
            this.parent.sp = this
        } catch (err) {
            console.error('you need set parents', this)
        }
        // drag(this)
    }
    setTextureKey(key) {
        try {
            this.tempKey = this.texture.textureCacheIds[0]
            this.texture = this.res.textures[key]
        } catch (err) {
            console.error(key, 'dont use textures or have no key')
        }
    }
    setLastTexture() {
        if (this.tempKey) {
            this.texture = this.res.textures[this.tempKey]
            this.tempKey = null
        }
    }
}