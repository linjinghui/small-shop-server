/**
 * 订单信息表
 */
const util = require('../util/util');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let schema = new Schema({
    // 商品总数量
    'count': {
      type: Number
    },
    // 商品总价
    'money': {
      type: Number
    },
    // 配送地址ID
    "consignees_id": {
      type: mongoose.Types.ObjectId
    },
    // 微信ID - 下单人
    'open_id': {
      type: String
    },
    // 订单状态 1：待确认，2：待备货，3：待分拣，4：待配送，5：已完成
    "status": {
      type: Number
    },
    // 备注
    "remark": {
      type: String
    },
    // 原因
    "reason": {
      type: String
    },
    // 下单时间
    'time': {
      type: Date
    },
    // 订单确认时间
    "confirm_time": {
      type: Date
    },
    // 备货时间
    "prepare_time": {
      type: Date
    },
    // 配送时间
    "distribution_time": {
      type: Date
    },
    // 完成时间
    "finish_time": {
      type: Date
    }
  });

  // 新增数据
  schema.statics.insert = function (data) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.create({
        // 商品总数量
        count: data.count || null,
        // 商品总价
        money: data.money || null,
        // 配送地址ID 
        consignees_id: mongoose.Types.ObjectId(data.consignees_id) || null,
        // 微信ID - 下单人
        open_id: data.open_id || null,
        // 订单状态 1：待确认，2：待备货，3：待分拣，4：待配送，5：已完成
        status: 1,
        // 备注
        remark: data.remark || null,
        // 原因
        reason: data.reason || null,
        // 下单时间
        time: Date.now(),
        // 订单确认时间
        confirm_time: null,
        // 备货时间
        prepare_time: null,
        // 配送时间
        distribution_time: null,
        // 完成时间
        finish_time: null
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

      // 商品总数量
      if (data.count) udata.count = data.count;
      // 商品总价
      if (data.money) udata.money = data.money;
      // 配送地址ID
      if (data.consignees_id) udata.consignees_id = mongoose.Types.ObjectId(data.consignees_id);
      // 订单状态 1：待确认，2：待备货，3：待分拣，4：待配送，5：已完成
      if (data.status) udata.status = data.status;
      // 原因
      if (data.reason) udata.reason = data.reason;
      // 订单确认时间
      if (data.confirm_time) udata.confirm_time = data.confirm_time;
      // 备货时间
      if (data.prepare_time) udata.prepare_time = data.prepare_time;
      // 配送时间
      if (data.distribution_time) udata.distribution_time = data.distribution_time;
      // 完成时间
      if (data.finish_time) udata.finish_time = data.finish_time;

      _this.updateOne({_id: mongoose.Types.ObjectId(data._id), open_id: user.open_id}, {$set: udata})
      .exec((err, ret) => {
        err ? reject(err) : resolve(ret);
      });
    });
  }

  // 查询订单
  schema.statics.search = function (page, size, condition, backKey) {
    const _this = this;
    page = parseInt(page) || 1;
    size = parseInt(size) || 20;

    if (condition) {
      // 去除空条件
      for (const key in condition) {
        !condition[key] && (delete condition[key]);
      }
    }
    return new Promise(function (resolve, reject) {
      // 查询总记录数
      _this.find(condition || {}).count().exec((err, total) => {
        if (err) {
          reject(err);
        } else {
          // 分页查询
          _this.find(condition || {}, backKey || '')
          .skip((page - 1) * size)
          .limit(size)
          .sort({'time': -1})
          .exec((err, ret) => {
            err ? reject(err) : resolve({list: ret, page: page, total: total});
          });
        }
      });
    });
  }

  // 返回model，其中order为数据库中表的名称
  return mongoose.model('Order', schema, 'order');
}