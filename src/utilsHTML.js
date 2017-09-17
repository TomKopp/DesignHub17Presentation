module.exports = (() => {
  const createElement = (tagName, attr) => {
    const el = document.createElement(tagName)

    Object.entries(attr).forEach(([key, value]) => {
      if (attr.classes) {
        el.classList.add(attr.classes)
      } else {
        el[key] = value
      }
    })

    return el
  }

  return Object.freeze({
    createElement
  })
})()
