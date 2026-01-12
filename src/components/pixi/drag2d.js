let quad
function onDragStart(event) {
    const obj = event.currentTarget
    obj.dragData = event.data
    obj.dragging = 1
    obj.dragPointerStart = event.data.getLocalPosition(obj.parent)
    obj.dragObjStart = new PIXI.Point()
    obj.dragObjStart.copyFrom(obj.position)
    obj.dragGlobalStart = new PIXI.Point()
    obj.dragGlobalStart.copyFrom(event.data.global)
}

function onDragEnd(event) {
    const obj = event.currentTarget
    obj.dragging = 0
    obj.dragData = null
    // set the interaction data to null
}

function onDragMove(event) {
    const obj = event.currentTarget
    if (!obj.dragging) return
    const data = obj.dragData // it can be different pointer!
    // if (obj.dragging === 1) {
    //     // click or drag?
    //     if (Math.abs(data.global.x - obj.dragGlobalStart.x) +
    //         Math.abs(data.global.y - obj.dragGlobalStart.y) >= 3) {
    //         // DRAG
    //         obj.dragging = 2
    //     }
    // }
    // if (obj.dragging === 2) {
    const dragPointerEnd = data.getLocalPosition(obj.parent)
    // DRAG
    const x = obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x)
    const y = obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y)
    obj.position.set(x, y)
    console.log(quad.map(({x, y}) => ({x, y})))

    // }
}

function addInteraction(obj) {
    obj.interactive = true
    obj
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)
}

function createSquare(x, y) {
    const square = new PIXI.Sprite(PIXI.Texture.WHITE)
    square.tint = 0xff0000
    square.factor = 1
    square.anchor = {x: 0.5, y: 0.5}
    // square.anchor.set(0.5)
    square.position.set(x, y)
    return square
}

const drag2 = (obj, app, p) => {
    const { width, height, x, y } = obj
    const squares = [
        createSquare(x, y),
        createSquare(x + width, y),
        createSquare(x + width, y + height),
        createSquare(x, y + height)
    ]
    app.ticker.add((delta) => {
        obj.proj.mapSprite(obj, quad)
    })
    quad = squares.map((s) => {
        p.addChild(s)
        addInteraction(s)
        return s.position
    })
}
export default drag2