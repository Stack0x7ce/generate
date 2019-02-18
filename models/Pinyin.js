class Pinyin {
  /**
   * pinyin
   */
  constructor() {
    this.pinyin = require('pinyin')
  }

  /**
   * 汉字转拼音
   * @param title
   * @return {*|void|string}
   */
  to(title) {
    return this.pinyin(title, {
      style: this.pinyin.STYLE_NORMAL
    })
      .join('-')
      .replace(/\s+/g, '')
  }
}

/**
 * export
 * @type {Pinyin}
 */
module.exports = new Pinyin()
