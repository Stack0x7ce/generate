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
   * js 对象转 yml
   * @param {*} data
   */
  dumpYaml(data) {
    return this.yaml.dump(data)
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

  /**
   * 路径是否存在
   * 存在返回 true
   * 不存在返回 false
   * @param {*} path
   */
  exists(path) {
    return this.fs.existsSync(path)
  }

  /**
   * 创建目录
   * @param {*} path
   */
  mkdir(path) {
    this.fs.mkdir(path, function(err) {
      if (err) {
        return console.error(err)
      }

      console.log('目录创建成功')
    })
  }
}

/**
 * export
 * @type {FileSystem}
 */
module.exports = new FileSystem()
