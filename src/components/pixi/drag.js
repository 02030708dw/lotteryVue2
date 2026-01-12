
let x, y
function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data
    // this.alpha = 0.5
    this.dragging = true
    const newPosition = this.data.getLocalPosition(this.parent)
    ;({x, y} = newPosition)
}

function onDragEnd(event) {
    const p = event.currentTarget
    // this.alpha = 1
    this.dragging = false
    // set the interaction data to null
    this.data = null
    p.afterDrag && p.afterDrag()
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent)
        this.isX ? this.x = this.x + newPosition.x - x : this.x = this.x
        this.isY ? this.y = this.y + newPosition.y - y : this.y = this.y
        ;({x, y} = newPosition)
        console.log(`${this.x.toFixed(1)}, ${this.y.toFixed(1)}`)
    }
}
const drag = (object, options = {}, afterDrag) => {
    const {isY = true, isX = true} = options
    afterDrag && (object.afterDrag = afterDrag)
    object.interactive = true
    object.buttonMode = true
    object.isX = isX
    object.isY = isY
    object
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)
}
export default drag
