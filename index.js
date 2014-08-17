;(function() {
var CURSOR_IMG = 'http://littlewargame.com/play/imgs/cursor.cur'

function hasPointerLock() {
  return 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document
}

if (!window.keyManager) {
  alert(
    'Could not find necessary LittleWarGame classes! Are you sure you ran this on the right site?')
} else if (!hasPointerLock) {
  alert('You browser doesn\'t seem to support pointer lock, sorry!')
} else {
  init()
}

var cursorElem
  , cursorX = 0
  , cursorY = 0
  , lwgMouseMove
  , lwgOnClick
  , lwgOnMouseDown
  , lwgOnMouseUp
function init() {
  document.addEventListener('pointerlockchange', onPointerLockChange)
  document.addEventListener('mozpointerlockchange', onPointerLockChange)
  document.addEventListener('webkitpointerlockchange', onPointerLockChange)

  var body = document.querySelector('body')
  body.addEventListener('click', function(e) {
    if (game && !isLocked()) {
      cursorX = e.pageX || e.clientX || 0
      cursorY = e.pageY || e.clientY || 0
      requestPointerLock(body)
    }
  })
  
  cursorElem = document.createElement('img')
  cursorElem.src = CURSOR_IMG
  cursorElem.style.position = 'fixed'
  cursorElem.style['z-index'] = 1000
  cursorElem.style.display = 'none'
  cursorElem.style.left = '0px'
  cursorElem.style.top = '0px'
  body.appendChild(cursorElem)
  body.style.overflow = 'hidden'
}

function requestPointerLock(elem) {
  (elem.requestPointerLock ||
    elem.mozRequestPointerLock ||
    elem.webkitRequestPointerLock).call(elem)
}

function exitPointerLock() {
  (document.exitPointerLock ||
    document.mozExitPointerLock ||
    document.webkitExitPointerLock).call(document)
}

var wasLocked = false
function isLocked() {
  return !!(document.pointerLockElement ||
    document.mozPointerLockElement ||
    document.webkitPointerLockElement)
}

function onPointerLockChange() {
  var canvas = document.querySelector('#canvas')
  if (!wasLocked && isLocked()) {
    wasLocked = true
    cursorElem.style.display = 'block'

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('click', onClick)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    lwgMouseMove = document.onmousemove
    lwgOnClick = document.onclick
    lwgOnMouseDown = canvas.onmousedown
    lwgOnMouseUp = canvas.onmouseup

    document.onmousemove = function() {}
    document.onclick = function() {}
    canvas.onmousedown = function() {}
    canvas.onmouseup = function() {}
    onAnimFrame()
  } else if (wasLocked && !isLocked()) {
    wasLocked = false
    cursorElem.style.display = 'none'

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('click', onClick)
    document.removeEventListener('mousedown', onMouseDown)
    document.removeEventListener('mouseup', onMouseUp)

    document.onmousemove = lwgMouseMove
    document.onclick = lwgOnClick
    canvas.onmousedown = lwgOnMouseDown
    canvas.onmouseup = lwgOnMouseUp

    lwgMouseMove = function() {}
    lwgOnClick = function() {}
    lwgOnMouseDown = function() {}
    lwgOnMouseUp = function() {}
  }
}

function onMouseMove(e) {
  var moveX = e.movementX || e.mozMovementX || e.webkitMovementX || 0
  var moveY = e.movementY || e.mozMovementY || e.webkitMovementY || 0
  var docWidth = document.documentElement.clientWidth
  var docHeight = document.documentElement.clientHeight
  
  cursorX += moveX
  cursorY += moveY
  
  if (cursorX < 0) cursorX = 0
  else if (cursorX >= docWidth) cursorX = docWidth - 1
  if (cursorY < 0) cursorY = 0
  else if (cursorY >= docHeight) cursorY = docHeight - 1

  // fake the mouse event for LWG's usage
  lwgMouseMove({ pageX: cursorX, pageY: cursorY })
  
  if (game_state != GAME.PLAYING || (game && game.gameHasEnded)) {
    exitPointerLock()
  }
}

function onClick(e) {
  lwgOnClick(e)
}

function onMouseDown(e) {
  lwgOnMouseDown(e)
}

function onMouseUp(e) {
  lwgOnMouseUp(e)
}

function onAnimFrame() {
  cursorElem.style.left = cursorX + 'px'
  cursorElem.style.top = cursorY + 'px'
  
  if (wasLocked) {
    requestAnimationFrame(onAnimFrame)
  }
}

})();
