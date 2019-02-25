class Qiniu {
  /**
   * qiniu
   * @param Access_Key
   * @param Secret_Key
   * @param bucket
   */
  constructor(Access_Key, Secret_Key, bucket) {
    this.qiniu = require('qiniu')
    this.qiniu.conf.ACCESS_KEY = Access_Key
    this.qiniu.conf.SECRET_KEY = Secret_Key
    this.bucket = bucket
  }

  /**
   * 构建上传策略函数
   * @param key
   */
  uptoken(key) {
    let putPolicy = new this.qiniu.rs.PutPolicy(this.bucket + ':' + key)
    return putPolicy.token()
  }

  /**
   * 构造上传函数
   * @param uptoken
   * @param key
   * @param localFile
   */
  uploadFile(uptoken, key, localFile) {
    let extra = new this.qiniu.io.PutExtra()
    this.qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if (!err) {
        // 上传成功， 处理返回值
        console.log(ret.hash, ret.key, ret.persistentId)
      } else {
        // 上传失败， 处理返回代码
        console.log(err)
      }
    })
  }

  /**
   * 判断空间是否存在该文件
   * @param key
   */
  getInfo(key) {
    let client = new this.qiniu.rs.Client()
    client.stat(this.bucket, key, function(err, ret) {
      if (!err) {
        return true
      } else {
        return false
      }
    });
  }
}

module.exports = Qiniu
