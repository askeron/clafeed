export function deleteItemFromArray(array, predicate) {
  for(let i = 0; i < array.length; i++){ 
    if (predicate(array[i])) { 
      array.splice(i, 1); 
      i--;
    }
  }
}


export function getTimeStringForSeconds(seconds) {
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

