// content.js

let dragging = false
let overlay
let toggle = false

const print = message => {
  console.log(message)
}

function createOverlayLink() {
  var a = document.createElement('a')

  // meta
  a.id = "beemarkoverlay"
  a.href = window.location.href
  a.innerHTML = document.title
  a.title = "Drag and Drop me in the Bookmarks Bar"

  // events
  a.draggable = "true"
  a.ondragstart = onDragStart
  a.ondragend = onDragEnd
  a.onmouseup = onMouseUp

  // styles
  a.style.position = "fixed"
  a.style.background = "rgba(255, 255, 255, .5)"
  a.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' he" +
      "ight='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fi" +
      "ll='%23fbd986' fill-opacity='.5' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13" +
      " 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6" +
      ".34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 3" +
      "5.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2." +
      "31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
  a.style.zIndex = 9999999
  a.style.top = 0
  a.style.left = 0
  a.style.bottom = 0
  a.style.right = 0
  a.style.fontSize = 0
  return a
}

const onDragStart = e => {
  print("onDragStart")
  let clone = e.target.cloneNode(true)
  dragging = true
  // hide ghost image
  clone.style.opacity = 0
  e
    .dataTransfer
    .setDragImage(clone, 0, 0)
}

const onKeyDown = e => {
  print("onKeyDown")
  if (event.metaKey && e.keyCode == 69) {
    toggleOverlay()
  }
}

const onDragEnd = e => {
  print("onDragEnd")
  if (dragging) {
    dragging = false
    toggleOverlay()
  }
}

const onMouseUp = e => {
  print("onMouseUp")
  if (dragging || overlay) {
    dragging = false
    toggleOverlay()
  }
}

const enableOverlay = () => {
  overlay = document
    .body
    .appendChild(createOverlayLink())
  overlay.style.cursor = "move"
}

const disableOverlay = () => {
  document
    .body
    .removeChild(overlay)
  overlay = null
}

const toggleOverlay = e => {
  overlay = overlay || document.getElementById("beemarkoverlay")
  if (toggle) {
    enableOverlay()
  } else {
    disableOverlay()
  }
  toggle = !toggle
}

const enable = () => {
  print("beemark enabled")
  document.addEventListener('keydown', onKeyDown)
}

const disable = () => {
  print("beemark disabled")
  document.removeEventListener('keydown', onKeyDown)
}

chrome
  .storage
  .local
  .get('toggle', data => {
    toggle = data.toggle
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
      toggle = !toggle
      if (changes.toggle.newValue) {
        print('toggle enabled')
        enable()
      } else {
        print('toggle disabled')
        disable()
      }
    }
  })