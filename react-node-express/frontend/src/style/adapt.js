(function (doc, win) {
  const docEl     = doc.documentElement
  const resizeEvt = "orientationchange" in win ? "orientationchange" : "resize"
  win.setREM    = function () {
    if (!docEl.clientWidth) return
    const clientWidth = docEl.clientWidth, pcPX = 1024, designWidth = 750, remBase = 100,
        baseWidth = clientWidth > pcPX ? pcPX : clientWidth, fontSize = remBase * (baseWidth / designWidth)
    docEl.style.fontSize = fontSize + "px"
  }
  win.setREM()
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, win.setREM, false)
  doc.addEventListener("DOMContentLoaded", win.setREM, false)
})(document, window)