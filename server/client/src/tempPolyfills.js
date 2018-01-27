// https://github.com/facebookincubator/create-react-app/issues/3199
const requestAnimationFrame = (global.requestAnimationFrame = callback => {
  setTimeout(callback, 0)
})

export default requestAnimationFrame
