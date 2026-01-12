import drag from '@C/pixi/drag'
import Container from './Container'
import Text from './Text'

export default class CurvedText extends PIXI.Sprite {
    constructor(objectData) {
        super()
        const curvedText = new PIXI.Text(objectData.text, objectData.style)
        curvedText.resolution = 2
        curvedText.style.trim = true
        curvedText.updateText()
        const radius = 140
        const maxRopePoints = 100
        const step = Math.PI / maxRopePoints
        const ropePoints = (maxRopePoints - Math.round((curvedText.texture.width / (radius * Math.PI)) * maxRopePoints)) / 2

        let points = []
        for (let i = maxRopePoints - ropePoints; i > ropePoints; i--) {
            const x = radius * Math.cos(step * i)
            const y = radius * Math.sin(step * i)
            points.push(new PIXI.Point(x, -y))
        }

        const container = new Container(objectData.p, {name: 'curvedText'})
        const rope = new PIXI.SimpleRope(curvedText.texture, points)
        container.addChild(rope)
        const bounds = container.getLocalBounds()
        const matrix = new PIXI.Matrix()
        matrix.tx = -bounds.x
        matrix.ty = -bounds.y
        container.x = objectData.x
        container.y = objectData.y
        // var renderTexture = PIXI.RenderTexture.create(bounds.width, bounds.height, 0, 0.752)
        // this.app.renderer.render( container, renderTexture, true, matrix, false );
    }
}