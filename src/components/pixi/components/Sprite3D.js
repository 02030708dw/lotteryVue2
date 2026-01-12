// import * as PIXI from 'pixi.js'
import drag from '@C/pixi/drag'

export default class Sprite3d extends PIXI.projection.Sprite3d {
    constructor(objectData) {
        super()
        this.objectData = objectData
        let { id, key, p, texture, ...options } = objectData
        if (texture) {
            this.texture = texture
        } else {
            this.res = PIXI.loadCache.resources[id]
            texture = this.res.texture || this.res.textures
            if (key) {
                this.texture = texture[key]
                this.name = key
            } else {
                this.texture = texture
                this.name = id
            }
        }
        Object.assign(this, options)
        try {
            p.addChild(this)
            this.parent.sp = this
        } catch (err) {
            console.error('you need set parents', this)
        }
        // drag(this)
    }
    setStop() {
        this.interactive = true
        this.on('pointerup', () => {})
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