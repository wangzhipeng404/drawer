import { HashTable, PenShape, Point, PenLine } from './hashTable'
import { List } from './list'
import { getUniqueColorKey, isInPolygon } from './utils'
const $select = document.getElementById('select')
const $copy = document.getElementById('copy')
const $drawRect = document.getElementById('draw-rect')
const $drawShape = document.getElementById('draw-shape')
const $eraser = document.getElementById('eraser')
const $undo = document.getElementById('undo')
const $del = document.getElementById('delte-btn')
const $cleanup = document.getElementById('cleanup')
const $connfirmBtn = document.getElementById('confirm-btn')
const $cancelBtn = document.getElementById('cancel-btn')
const hintCanvas = document.getElementById('hint-canvas') as HTMLCanvasElement
const mainCanvas = document.getElementById('main-canvas') as HTMLCanvasElement
const mainContext = mainCanvas.getContext('2d')
const context = hintCanvas.getContext('2d')
let hashTable = new HashTable<PenShape>()
let currentPenline: PenShape = null
let copyPenLine: PenShape = null
let eraserRadius = 10
let isErasePoint = true
let editMode: 'draw' | 'eraser' | 'select' | 'edit' | 'copy' = 'draw'
let drawMode: 'rect' | 'shape' = 'rect'
let shapeState: 'enable' | 'disable' = 'disable'
function removeBtnActive () {
  const els = document.getElementsByClassName('btn-active')
  for (let i = 0; i < els.length; i++) {
    els[i].classList.remove('btn-active')
  }
}
$select.addEventListener('click', (e) => {
  e.preventDefault()
  editMode = 'select'
  removeBtnActive()
  $select.classList.add('btn-active')
})

$copy.addEventListener('click', (e) => {
  e.preventDefault()
  editMode = 'copy'
  removeBtnActive()
  $copy.classList.add('btn-active')
})

$drawRect.addEventListener('click', (e) => {
  e.preventDefault()
  editMode = 'draw'
  drawMode = 'rect'
  shapeState = 'enable'
  removeBtnActive()
  $drawRect.classList.add('btn-active')
})

$drawShape.addEventListener('click', (e) => {
  e.preventDefault()
  editMode = 'draw'
  drawMode = 'shape'
  shapeState = 'enable'
  removeBtnActive()
  $drawShape.classList.add('btn-active')
})

/* $eraser.addEventListener('click', (e) => {
  e.preventDefault()
  console.log('eraser')
  editMode = 'eraser'
})
 */
$cleanup.addEventListener('click', (e) => {
  e.preventDefault()
  hashTable = new HashTable<PenShape>()
  mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  removeBtnActive()
  $drawRect.classList.add('btn-active')
})

$undo.addEventListener('click', (e) => {
  e.preventDefault()
  const last = hashTable.last()
  if (last) {
    hashTable.del(last.colorKey)
    mainDraw()
  }
  removeBtnActive()
  $drawRect.classList.add('btn-active')
})

$del.addEventListener('click', (e) => {
  e.preventDefault()
  if (currentPenline) {
    hashTable.del(currentPenline.colorKey)
    currentPenline = null
    hintClear()
    mainDraw()
    editMode = 'draw'
  }
})

$connfirmBtn.addEventListener('click', (e) => {
  if (editMode === 'edit') {
    hashTable.set(currentPenline.colorKey, currentPenline)
    currentPenline = null
    hintClear()
    mainDraw()
    editMode = 'draw'
  }
  removeBtnActive()
  $drawRect.classList.add('btn-active')
})

$cancelBtn.addEventListener('click', (e) => {
  if (editMode === 'edit') {
    if (copyPenLine) {
      const restShape = new PenShape(currentPenline.colorKey)
      restShape.points.addList(copyPenLine.points)
      hashTable.set(currentPenline.colorKey, restShape)
      copyPenLine = null
    }
    currentPenline = null
    hintClear()
    mainDraw()
    editMode = 'draw'
  }
  removeBtnActive()
  $drawRect.classList.add('btn-active')
})

const {
  width: rectWidth,
  height: rectHeight,
  left: rectLeft,
  top: reactTop
} = hintCanvas.getBoundingClientRect()
const { width: canvasWidth, height: canvasHeight } = hintCanvas
const scaleX = (canvasWidth / rectWidth)
const scaleY = (canvasHeight / rectHeight)
const offsetLeft = rectLeft
const offsetTop = reactTop

function hintClear () {
  context.clearRect(0, 0, hintCanvas.width, hintCanvas.height)
}

function mainClear () {
  mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
}

function hintDraw () {
  hintClear()
  currentPenline.draw(context, true, editMode !== 'draw' || drawMode === 'rect')
}

function mainDraw() {
  mainContext.clearRect(0, 0, mainContext.canvas.width, mainContext.canvas.height); // 清除画布内容
  hashTable.foreach((key, val) => {
    if (!currentPenline || key !== currentPenline.colorKey) {
      val.draw(mainContext, false, true)
    }
  })
}

let keepPoint: Point
let keepPointIndex: number
hintCanvas.addEventListener('mousedown', function (e) {
  e.preventDefault()
  const point: Point = new Point(
    Math.floor((e.pageX - offsetLeft) * scaleX),
    Math.floor((e.pageY - offsetTop) * scaleY),
  )
  if (editMode === 'edit') {
    currentPenline.points.foreach((index, p) => {
      if (Math.abs(p.x - point.x) < 3 && Math.abs(p.y - point.y) < 3) {
        keepPointIndex = index
      }
    })
  }
  if (editMode === 'draw') {
    if (!currentPenline) {
      const colorKey = getUniqueColorKey(hashTable)
      currentPenline = new PenShape(colorKey)
    }
    if (drawMode === 'rect') {
      currentPenline.points.add(point)
      currentPenline.points.add(point)
      currentPenline.points.add(point)
      currentPenline.points.add(point)
    }
    if (drawMode === 'shape') {
      const len = currentPenline.points.length()
      if (len === 0) {
        currentPenline.points.add(point)
      } else {
        const p0 = currentPenline.points.get(0)
        if (Math.abs(p0.x - point.x) < 3 && Math.abs(p0.y - point.y) < 3) {
          currentPenline.points.remove(len - 1)
          // shapeState = 'disable'
          hashTable.set(currentPenline.colorKey, currentPenline)
          currentPenline = null
          hintClear()
          mainDraw()
        }
      }
      if (currentPenline && shapeState === 'enable') {
        currentPenline.points.add(point)
      }
    }
  }
  if (editMode === 'select' || editMode === 'copy') {
    hashTable.foreach(key => {
      if (isInPolygon(point, hashTable.get(key).points)) {
        currentPenline = hashTable.get(key)
      }
    })
    if (currentPenline) {
      copyPenLine = currentPenline.copy(getUniqueColorKey(hashTable))
      if (editMode === 'copy') {
        currentPenline = copyPenLine
        copyPenLine = null
      }
      keepPoint = point
      mainDraw()
    }
  }
  if (currentPenline) {
    hintDraw()
  }
})

const onMouseMoveHandler = function (e: MouseEvent) {
  e.preventDefault()
  if (currentPenline) {
    const x = Math.floor((e.pageX - offsetLeft) * scaleX)
    const y = Math.floor((e.pageY - offsetTop) * scaleY)
    if (editMode === 'draw') {
      if (drawMode === 'rect') {
        const point0 = currentPenline.points.get(0)
        const point1: Point = new Point(point0.x, y)
        const point2: Point = new Point(x, y)
        const point3: Point = new Point(x, point0.y)
        currentPenline.points.set(1, point1)
        currentPenline.points.set(2, point2)
        currentPenline.points.set(3, point3)
      }
      if (drawMode === 'shape' && shapeState === 'enable') {
        currentPenline.points.set(currentPenline.points.length() - 1, new Point(x, y))
      }
      hintDraw()
    }
    if (editMode === 'select' || editMode === 'copy') {
      currentPenline.points.foreach((index, point) => {
        currentPenline.points.set(index, new Point(point.x - (keepPoint.x - x), point.y - (keepPoint.y - y)))
      })
      keepPoint = new Point(x, y)
      hintDraw()
    }
    if (editMode === 'edit') {
      if(keepPointIndex !== null) {
        currentPenline.points.set(keepPointIndex, new Point(x, y))
        hintDraw()
      }
    }
  }
}

hintCanvas.addEventListener('mousemove', onMouseMoveHandler);
hintCanvas.addEventListener('mouseup', function (e) {
  e.preventDefault()
  if (keepPointIndex !== null) {
    keepPointIndex = null
  }
  if (editMode === 'select') {
    editMode = 'edit'
    removeBtnActive()
  }
  console.log(editMode, drawMode)
  if ((editMode === 'draw' && drawMode === 'rect') || editMode === 'copy') {
    console.log('up')
    hashTable.set(currentPenline.colorKey, currentPenline)
    currentPenline = null
    hintClear()
    mainDraw()
  }
});

hintCanvas.addEventListener('mouseleava', function (e) {
});