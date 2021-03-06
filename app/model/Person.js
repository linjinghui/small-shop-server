/**
 * 商户信息表
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let schema = new Schema({
    // 头像
    avatar: {
      type: String
    },
    // 手机号
    mobile: {
      type: String
    },
    // 姓名
    name: {
      type: String
    },
    // 帐号
    account: {
      type: String
    },
    // 密码
    pwd: {
      type: String
    },
    // 加入时间
    time: {
      type: Date
    }
  });

  // 新增数据
  schema.statics.insert = function (data) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.create({
        // 头像
        avatar: data.avatar || null,
        // 手机号
        mobile: data.mobile || null,
        // 姓名
        name: data.name || null,
        // 帐号
        account: data.account || null,
        // 密码
        pwd: data.pwd || null,
        // 加入时间
        time: Date.now()
      }, function (err, ret) {
        if (err) {
          reject(err);
        } else {
          resolve(ret);
        }
      });
    });
  }

  // 单个查询
  schema.statics.find = function (data) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.findOne(data, function (err, ret) {
        err ? reject(err) : resolve(ret);
      });
    });
  }

  // 返回model，其中person为数据库中表的名称
  return mongoose.model('Person', schema, 'person');
}