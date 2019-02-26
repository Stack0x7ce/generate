class Process {
  /**
   * 比较时间大小
   * @param aDate
   * @param bDate
   * @return {boolean}
   */
  comparativeDate(aDate, bDate) {
    let aTimestamp = new Date(aDate).getTime()
    let bTimestamp = new Date(bDate).getTime()

    if (aTimestamp < bTimestamp) {
      return true
    } else {
      return false
    }
  }

  /**
   * 数组对象按时间字段排序 sort
   * @param arr
   */
  reorder(arr) {
    let result = arr.sort((a, b) => {
      return this.comparativeDate(a.created, b.created)
    })
  }
}

/**
 * export
 * @type {Process}
 */
module.exports = new Process()
