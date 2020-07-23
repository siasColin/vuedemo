const isEmpty = function (val) {
  if (val != null && val != undefined && val != '' && val != 'null' && val != 'undefined') {
    return false
  } else {
    return true
  }
}
export default { isEmpty }
