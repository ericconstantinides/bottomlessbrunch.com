// Object Helper Functions
/*
  objectFunctions.keys.next(someObj, 4)
  objectFunctions.keys.previous(someObj, 11)

*/
const objectFunctions = {}
objectFunctions.keys = {}

// get the next key in an object
objectFunctions.keys.next = function (myObject, id) {
  const stringId = id.toString()
  let keys = Object.keys(myObject)
  let index = keys.indexOf(stringId)
  let nextIndex = (index += 1)
  if (nextIndex >= keys.length) {
    // we're at the end, so return the first item
    return Object.keys(myObject)[0]
  }
  return keys[nextIndex]
}

// Get the previous key in an object.
objectFunctions.keys.previous = function (myObject, id) {
  const stringId = id.toString()
  let keys = Object.keys(myObject)
  let index = keys.indexOf(stringId)
  let previousIndex = (index -= 1)
  if (previousIndex < 0) {
    // we're at the beginning, so send the last:
    return (
      Object.keys(myObject)[Object.keys(myObject).length - 1]
    )
  }
  return keys[previousIndex]
}

export default objectFunctions
