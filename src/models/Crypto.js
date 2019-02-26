class Crypto {
  /**
   * crypto
   * @param secret
   * @param Algorithm
   */
  constructor(secret, Algorithm) {
    this.crypto = require('crypto')
    this.secret = secret
    this.Algorithm = Algorithm
  }

  /**
   * 加密
   * @param content
   * @returns {IDBRequest<IDBValidKey> | Promise<void> | void | *}
   */
  cipher(content) {
    // 构建
    let cipher = this.crypto.createCipher(this.Algorithm, this.secret)
    // 更新加密数据
    let crypted = cipher.update(content, 'utf8', 'hex')
    // 生成加密数据
    crypted += cipher.final('hex')
    // 返回加密数据
    return crypted
  }

  /**
   * 解密
   * @param content
   * @returns {IDBRequest<IDBValidKey> | Promise<void> | void | *}
   */
  decipher(content) {
    // 构建
    let decipher = this.crypto.createDecipher(this.Algorithm, this.secret)
    // 更新解密数据
    let decrypted = decipher.update(content, 'hex', 'utf8')
    // 生成解密数据
    decrypted += decipher.final('utf8')
    // 返回解密数据
    return decrypted
  }
}

/**
 * export
 * @type {Crypto}
 */
module.exports = Crypto
