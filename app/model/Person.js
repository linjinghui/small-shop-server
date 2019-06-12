/**
 * 用户表
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
    // 微信ID
    'open_id': {
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
    // 帐号类型 1: 商家 2: 买家 3: 子帐号
    type: {
      type: Number
    },
    // 买家帐号所属商家, 可以对应多个所属商家ID
    'person_id': {
      type: Array,
      default: null
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
        // 微信ID
        open_id: data.open_id || null,
        // 帐号
        account: data.account || null,
        // 密码
        pwd: data.pwd || null,
        // 帐号类型 1: 商家 2: 买家
        type: data.type || null,
        // 买家帐号所属商家
        auth_id: data.auth_id || null,
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