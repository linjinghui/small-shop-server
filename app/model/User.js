/**
 * 用户信息表
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
    // 买家帐号所属商家
    'person_id': {
      type: mongoose.Types.ObjectId
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
        // 买家帐号所属商家
        person_id: mongoose.Types.ObjectId(data.person_id) || null
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
  schema.statics.find = function (condition) {
    const _this = this;

    // 转换对象中的ObjectId
    let parseObjectId = obj => {
      if (obj._id) {
        obj._id = mongoose.Types.ObjectId(obj._id);
      }
      if (obj.person_id) {
        obj.person_id = mongoose.Types.ObjectId(obj.person_id);
      }
      return obj;
    }

    if (condition) {
      condition = parseObjectId(condition);
      (condition.$or || []).forEach(item => {
        item = parseObjectId(item);
      });
    }

    return new Promise(function (resolve, reject) {
      _this.findOne(condition, function (err, ret) {
        err ? reject(err) : resolve(ret);
      });
    });
  }

  // 返回model，其中 user 为数据库中表的名称
  return mongoose.model('User', schema, 'user');
}