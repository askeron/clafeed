export function deleteItemFromArray(array, predicate) {
  for(let i = 0; i < array.length; i++){ 
    if (predicate(array[i])) { 
      array.splice(i, 1); 
      i--;
    }
  }
}

function getTimeStringForSeconds(seconds) {
  if (seconds === 0) {
    return "0:00"
  }

  const signString = seconds < 0 ? "-" : ""
  if (seconds < 0) {
    seconds = 0 - seconds
  }
  const secondsToShow = seconds % 60
  const minutesToShow = Math.floor((seconds / 60) % 60)
  const hoursToShow = Math.floor(seconds / 60 / 60)
  if (hoursToShow > 0) {
    return `${signString}${hoursToShow}:${(""+minutesToShow).padStart(2, '0')}:${(""+secondsToShow).padStart(2, '0')}`
  } else {
    return `${signString}${minutesToShow}:${(""+secondsToShow).padStart(2, '0')}`
  }
}

export function getSecondsLeftString(millis) {
  const offsetToPreventJumpingMillis = 5
  const secondsLeft = Math.round((millis-offsetToPreventJumpingMillis)/1000)
  return getTimeStringForSeconds(secondsLeft)
}

export function getArraySortedBy(array, mapFunction) {
  const result = array.map(x => x)
  result.sort((a, b) => mapFunction(a) > mapFunction(b) ? 1 : -1)
  return result
}

export function getArraySortedByDesc(array, mapFunction) {
  const result = array.map(x => x)
  result.sort((a, b) => mapFunction(a) > mapFunction(b) ? -1 : 1)
  return result
}

export function getQuizLetterStringFromIndex(index) {
  return String.fromCharCode(65 + index)
}

export function getIndiciesFromCount(count) {
  return Array.from(Array(count).keys())
}
