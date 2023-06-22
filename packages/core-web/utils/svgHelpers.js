
const { Snap } = window

/**
 * Load svg asset to specific wrapper in HTML document
 * @param {string} wrapperSelector target DOM element to append svg source
 * @param {string} source path to svg file
 */
export function loadSvgSource (wrapperSelector, source) {
  const svgFilterSnap = Snap(wrapperSelector)

  Snap.load(source, (frag) => {
    svgFilterSnap.append(frag)
  })
}
