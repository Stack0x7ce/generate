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
 * 配置文件
 * @type {*}
 */
var config = FileSystem.readYamlFile('./_config.yml')

// 定义数据
var data = {
  categories: [],
  posts: [],
  routes: []
}

// 获取分类
var categories = FileSystem.readDir(config.postsPath)

// 循环获取内容，保存到数据中
for (let category of categories) {
  data.categories.push(category)

  let categoryPath = config.postsPath + '/' + category
  let posts = FileSystem.readDir(categoryPath)

  for (let post of posts) {
    let postPath = categoryPath + '/' + post
    let content = FileSystem.readFile(postPath + '/README.md')
    let yaml = FileSystem.readYamlFile(postPath + '/README.yml')
    let route = Pinyin.to(post)

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

    data.routes.push('/post/' + route)
  }
}

console.log(data)

// 按时间排序
Process.reorder(data.posts)

// 将数据写入文件
FileSystem.writeFile(config.dbPath, JSON.stringify(data))
