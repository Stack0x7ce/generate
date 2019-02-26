class FileSystem {
  /**
   * fs
   * js-yaml
   */
  constructor() {
    this.fs = require('fs')
    this.yaml = require('js-yaml')
  }

  /**
   * 读取目录下的文件
   * @param path
   * @return {*}
   */
  readDir(path) {
    return this.fs.readdirSync(path)
  }

  /**
   * 读取文件内容
   * @param path
   * @return {*}
   */
  readFile(path) {
    return this.fs.readFileSync(path).toString()
  }

  /**
   * 读取 yaml 文件
   * @param path
   * @return {*}
   */
  readYamlFile(path) {
    return this.yaml.safeLoad(this.fs.readFileSync(path))
  }

  /**
   * 写入文件
   * @param path
   * @param data
   * @return {*}
   */
  writeFile(path, data) {
    return this.fs.writeFileSync(path, data)
  }
}

/**
 * export
 * @type {FileSystem}
 */
module.exports = new FileSystem()
