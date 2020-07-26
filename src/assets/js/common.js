const isEmpty = function (val) {
  if (
    val != null &&
    val != undefined &&
    val != '' &&
    val != 'null' &&
    val != 'undefined'
  ) {
    return false
  } else {
    return true
  }
}
/* 外部静态资源文件路径 */
const staticSourceBaseUrl = 'http://localhost:8081'
export default { isEmpty, staticSourceBaseUrl }
