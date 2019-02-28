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

/**
 * require
 * @type {Qiniu}
 */
const QiniuModel = require('./models/Qiniu')

/**
 * require
 * @type {Crypto}
 */
const CryptoModel = require('./models/Crypto')

/**
 * 配置文件
 * @type {*}
 */
const configPath = './_config.yml'
const config = FileSystem.readYamlFile(configPath)

/**
 * 实例化
 * @type {Qiniu}
 */
const Qiniu = new QiniuModel(
  config.qiniu.Access_Key,
  config.qiniu.Secret_Key,
  config.qiniu.bucket
)

/**
 * 实例化
 * @type {Crypto}
 */
const Crypto = new CryptoModel(config.crypto.secret, config.crypto.Algorithm)

// 正则表达式
const reg = /!\[(.*)\]\((.*)\)/g
const reg2 = /^!\[(.*)\]\((.*)\)/

// 定义数据
var data = {
  categories: [],
  posts: [],
  routes: []
}

// 获取分类
var categories = FileSystem.readDir(config.postPath)

// 循环获取内容，保存到数据中
for (let category of categories) {
  data.categories.push(category)

  let categoryPath = config.postPath + category

  let posts = FileSystem.readDir(categoryPath)

  for (let post of posts) {
    let postPath = categoryPath + '/' + post
    var content = FileSystem.readFile(postPath + '/README.md')
    let yaml = FileSystem.readYamlFile(postPath + '/README.yml')
    let route = Pinyin.to(post)

    // 获取内容中图片
    let imgs = content.match(reg)

    // 处理图片信息
    for (let img of imgs) {
      // 获取图片详细信息
      let result = img.match(reg2)
      // 图片名称
      let imgName = result[1]
      // 图片链接
      let imgUrl = result[2]
      // 图片路径
      let imgPath = postPath + '/' + result[2]
      // 图片后缀
      let imgExt = result[2].split('.').pop()

      // 生成 key
      let key = Crypto.cipher(yaml.created + imgName) + '.' + imgExt
      // 判断图片是否已经上传过，如果没有就上传
      Qiniu.getInfo(key, imgPath)

      // 图片链接
      url = config.qiniu.cdnDomain + '/' + key
      // 替换图片地址
      content = content.replace(imgUrl, url)
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

    // Hexo
    let frontMatter = {
      title: post,
      date: yaml.created,
      author: config.author,
      img: yaml.img,
      top: yaml.top,
      cover: yaml.cover,
      coverImg: yaml.coverImg,
      categories: category,
      tags: yaml.tags
    }

    let hexo = `---\n` + FileSystem.dumpYaml(frontMatter) + `---\n\n` + content

    hcategoryPath = config.hexoPostPath + category + '/'

    let exists = FileSystem.exists(hcategoryPath)

    if (!exists) {
      // 不存在创建目录
      FileSystem.mkdir(hcategoryPath)
    }

    let hpath = hcategoryPath + post + '.md'

    FileSystem.writeFile(hpath, hexo)
  }
}

console.log(data)

// 按时间排序
Process.reorder(data.posts)

// 将数据写入文件
FileSystem.writeFile(config.dbPath, JSON.stringify(data))
