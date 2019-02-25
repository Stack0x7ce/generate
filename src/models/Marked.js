class Marked {
  /**
   * marked
   */
  constructor() {
    this.marked = require('marked')
    this.marked.setOptions({
      renderer: new this.marked.Renderer(),
      highlight: function(code) {
        return require('highlight.js').highlightAuto(code).value
      },
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    })
  }

  /**
   * 渲染 markdown
   * @param content
   * @return {*|void|*|void}
   */
  renderer(content) {
    return this.marked(content)
  }
}

/**
 * export
 * @type {Marked}
 */
module.exports = new Marked()
