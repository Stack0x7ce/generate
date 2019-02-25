/**
 * require
 * @type {FileSystem}
 */
const FileSystem = require('./models/FileSystem')
/**
 * require
 * @type {Marked}
 */
const Marked = require('./models/Marked')
/**
 * require
 * @type {Pinyin}
 */
const Pinyin = require('./models/Pinyin')
/**
 * require
 * @type {Process}
 */
const Process = require('./models/Process')

const QiniuModel = require('./models/Qiniu')

const CryptoModel = require('./models/Crypto')

/**
 * 配置文件
 * @type {*}
 */

const configPath = './_config.yml'
const config = FileSystem.readYamlFile(configPath)

const Qiniu = new QiniuModel(
  config.Access_Key,
  config.Secret_Key,
  config.bucket
)

const Crypto = new CryptoModel(config.secret, config.Algorithm)

// 正则表达式
const reg = /!\[(.*)\]\((.*)\)/g
const reg2 = /^!\[(.*)\]\((.*)\)/

console.log(config)

// return

// 定义数据
var data = {
  categories: [],
  posts: [],
  routes: []
}

// 获取分类
var categories = FileSystem.readDir(config.postPath)

console.log(categories)

// 循环获取内容，保存到数据中
for (let category of categories) {
  data.categories.push(category)

  let categoryPath = config.postPath + category
  //
  // console.log(categoryPath)
  //
  // return

  let posts = FileSystem.readDir(categoryPath)
  //
  // console.log(posts)
  //
  // return

  for (let post of posts) {
    let postPath = categoryPath + '/' + post

    // console.log(postPath)
    //
    // return

    let content = FileSystem.readFile(postPath + '/README.md')
    let yaml = FileSystem.readYamlFile(postPath + '/README.yml')
    let route = Pinyin.to(post)

    // 处理 content 中图片
    // 获取图片信息

    let imgs = content.match(reg)

    for (let img of imgs) {
      let result = img.match(reg2)

      // 图片名称
      let imgName = result[1]
      // 图片路径
      let imgPath = postPath + '/' + result[2]
      // 图片后缀
      let imgExt = result[2].split('.').pop()
      //
      // console.log( imgName, imgPath, imgExt)

      let key = Crypto.cipher(imgName) + '.' + imgExt

      // console.log(key)

      let info = Qiniu.getInfo(key)

      if (!info) {
        // 图片不存在
        // 生成上传 token
        let uptoken = Qiniu.uptoken(key)
        // 调用 uploadFile 上传
        Qiniu.uploadFile(uptoken, key, imgPath)
      }

      url = config.cdnDomain + '/' + key

    }

    data.posts.push({
      route: route,
      title: post,
      category: category,
      top: yaml.top,
      created: yaml.created,
      updated: yaml.updated,
      tags: yaml.tags,
      description: content,
      content: Marked.renderer(content)
    })

    data.routes.push('/posts/' + category + '/' + route)
  }
}

console.log(data)

// 按时间排序
Process.reorder(data.posts)

// 将数据写入文件
FileSystem.writeFile(config.dbPath, JSON.stringify(data))
