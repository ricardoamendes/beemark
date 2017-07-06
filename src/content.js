// content.js

let overlay
let overlayLink

const createOverlayLink = () => {
  var a = document.createElement('a')

  // meta
  a.id = "beemarkoverlay"
  a.href = window.location.href
  a.innerHTML = document.title
  a.title = "Drop me in Bookmarks"

  // events
  a.draggable = "true"
  a.onclick = onClick
  a.ondragstart = onDragStart
  a.ondragend = onDragEnd
  a.onmouseup = onMouseUp
  a.style.position = "fixed"
  a.style.zIndex = 9999999
  a.style.top = 0
  a.style.left = 0
  a.style.bottom = 0
  a.style.right = 0
  a.style.fontSize = 0
  return a
}

const onClick = e => e.preventDefault()

const onDragStart = e => {
  let clone = e.target.cloneNode(true)
  clone.style.opacity = 0 // hide ghost image
  e.dataTransfer.setDragImage(clone, 0, 0)
}

const onKeyDown = e => {
  if (e.shiftKey && !overlay) {
    enableOverlay();
  }
}

const onKeyUp = e => {
  if (e.keyCode === 16 && overlay) {
    disableOverlay()
  }
}

const onDragEnd = e => {
  overlay.style.cursor = "default"
  if (overlay) {
    disableOverlay()
  }
}

const onMouseUp = e => {
  if (overlay) {
    disableOverlay()
  }
}

const enableOverlay = () => {
  overlayLink = overlayLink || createOverlayLink()
  overlay = document.body.appendChild(overlayLink)
  overlay.style.cursor = "move"
}

const disableOverlay = () => {
  document.body.removeChild(overlay)
  overlay = null
}

const enable = () => {
  document.addEventListener('keyup', onKeyUp)
  document.addEventListener('keydown', onKeyDown)
}

const disable = () => {
  document.removeEventListener('keyup', onKeyUp)
  document.removeEventListener('keydown', onKeyDown)
}

chrome
  .storage
  .local
  .get('toggle', data => {
    if (data.toggle === false) {
      disable()
    } else {
      enable()
    }
  })

chrome
  .storage
  .onChanged
  .addListener((changes, areaName) => {
    if (areaName == "local" && changes.toggle) {
      if (changes.toggle.newValue) {
        enable()
      } else {
        disable()
      }
    }
  })