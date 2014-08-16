;(function() {

function hasPointerLock() {
  return 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document
}

if (!window.keyManager) {
  alert('Could not find necessary LittleWarGame classes! Are you sure you ran this on the right site?')
} else if (!hasPointerLock) {
  alert('You browser doesn\'t seem to support pointer lock, sorry!')
} else {
  init()
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

function onPointerLockChange() {
  console.dir(arguments)
}

function init() {
  document.addEventListener('pointerlockchange', onPointerLockChange)
  document.addEventListener('mozpointerlockchange', onPointerLockChange)
  document.addEventListener('webkitpointerlockchange', onPointerLockChange)

  requestPointerLock(document.querySelector('#canvas'))
}

})();
