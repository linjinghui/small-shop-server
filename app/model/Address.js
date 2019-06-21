/**
 * 配送地址表
 */
const util = require('../util/util');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let schema = new Schema({
    // 收货人电话
    'mobile': {
      type: String
    },
    // 收货人姓名
    'name': {
      type: String
    },
    // 微信ID
    'open_id': {
      type: String
    },
    // 收获地址
    'address': {
      type: String
    },
    // 收获门牌地址
    'door_address': {
      type: String
    },
    // 创建时间
    'time': {
      type: Date
    },
    // 更新时间
    'update_time': {
      type: Date
    }
  });

  // 新增数据
  schema.statics.insert = function (data, user) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.create({
        // 收货人电话
        mobile: data.mobile || null,
        // 收货人姓名
        name: data.name || null,
        // 微信ID
        open_id: user.open_id,
        // 收获地址
        address: data.address || null,
        // 收获门牌地址
        door_address: data.door_address || null,
        // 加入时间
        time: Date.now(),
        // 更新时间
        update_time: null
      }, function (err, ret) {
        if (err) {
          reject(err);
        } else {
          resolve(ret);
        }
      });
    });
  }

  // 删除数据
  schema.statics.delete = function (id, open_id) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.deleteOne({_id: mongoose.Types.ObjectId(id), open_id: open_id})
      .exec((err, ret) => {
        err ? reject(err) : resolve(ret);
      });
    });
  }

  // 更新数据
  schema.statics.update = function (data, user) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      let udata = {};

      if (data.mobile) udata.mobile = data.mobile;
      if (data.name) udata.name = data.name;
      if (data.address) udata.address = data.address;
      if (data.door_address) udata.door_address = data.door_address;
      if (JSON.stringify(udata).length > 2) udata.update_time = Date.now();

      _this.updateOne({_id: mongoose.Types.ObjectId(data._id), open_id: user.open_id}, {$set: udata})
      .exec((err, ret) => {
        err ? reject(err) : resolve(ret);
      });
    });
  }

  // 查询
  schema.statics.search = function (data, backKey) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.find(data, backKey || '', function (err, ret) {
        err ? reject(err) : resolve(ret);
      });
    });
  }

  // 返回model，其中address为数据库中表的名称
  return mongoose.model('Address', schema, 'address');
}