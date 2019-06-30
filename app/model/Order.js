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
    // 拥有者ID
    'person_id': { 
      type: mongoose.Types.ObjectId 
    },
    // 订单状态 0: 已删除, 1：待确认，2：待备货，3：备货中，4：待分拣，5：待配送，6：配送中，7：已完成
    "status": {
      type: Number
    },
    // 送达时间
    "arriveTime": {
      type: String
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
        // 拥有者
        person_id: mongoose.Types.ObjectId(data.person_id) || null,
        // 订单状态 0: 已删除, 1：待确认，2：待备货，3：备货中，4：待分拣，5：待配送，6：配送中，7：已完成
        status: 1,
        // 送达时间
        arriveTime: data.arriveTime || null,
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
  schema.statics.update = function (condition, data) {
    const _this = this;
    // 转换对象中的ObjectId
    const parseObjectId = obj => {
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
    }
    
    return new Promise(function (resolve, reject) {
      let udata = {};

      // 商品总数量
      if (data.count) udata.count = data.count;
      // 商品总价
      if (data.money) udata.money = data.money;
      // 配送地址ID
      if (data.consignees_id) udata.consignees_id = mongoose.Types.ObjectId(data.consignees_id);
      // 订单状态 0: 已删除, 1：待确认，2：待备货，3：备货中，4：待分拣，5：待配送，6：配送中，7：已完成
      if (data.status || data.status === 0) udata.status = data.status;
      // 送达时间
      if (data.arriveTime) udata.arriveTime = data.arriveTime;
      // 备注
      if (data.remark) udata.remark = data.remark;
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

      console.log('====order update===');
      console.log(JSON.stringify(data));
      console.log(JSON.stringify(udata));
      _this.updateOne(condition, {$set: udata})
      .exec((err, ret) => {
        err ? reject(err) : resolve(ret);
      });
    });
  }

  // 查询订单列表
  schema.statics.search = function (page, size, condition, backKey) {
    const _this = this;
    page = parseInt(page) || 1;
    size = parseInt(size) || 20;

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
    // 去除空条件
    for (const key in condition) {
      !condition[key] && (delete condition[key]);
    }

    return new Promise(function (resolve, reject) {
      // 查询总记录数
      _this.find(condition || {}).countDocuments().exec((err, total) => {
        if (err) {
          reject(err);
        } else {
          // 分页查询
          _this
          .aggregate([
            {
              // 关联表
              $lookup: {
                // 表明
                from: "orderProduct",
                // 本表需要关联的字段
                localField: "_id",
                // 被关联表需要关联的字段
                foreignField: "order_id",
                // 结果集别名
                as: "order_product"
              }
            }, 
            {
              // 查询条件
              $match: condition || {}
            }, 
            {
              // 指定返回字段
              $project: backKey
            }
          ])
          .sort({'time': -1})
          .skip((page - 1) * size)
          .limit(size)
          .exec((err, ret) => {
            err ? reject(err) : resolve({list: ret, page: page, total: total});
          });
        }
      });
    });
  }

  // 查询订单列表 - 不关联其他数据
  schema.statics.searchSingle = function (page, size, condition, backKey) {
    const _this = this;
    page = parseInt(page) || 1;
    size = parseInt(size) || 20;
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
          _this.find(condition || {}, backKey || '').skip((page - 1) * size).limit(size).exec((err, ret) => {
            err ? reject(err) : resolve({list: ret, page: page, total: total});
          });
        }
      });
    });
  }
  
  // 查询单个订单
  schema.statics.searchOne = function (condition, backKey) {
    const _this = this;

    if (condition) {
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
      // 去除空条件
      for (const key in condition) {
        !condition[key] && (delete condition[key]);
      }
    }
    return new Promise(function (resolve, reject) {
      // 查询总记录数
      _this.findOne(condition || {}, backKey).exec((err, ret) => {
        err ? reject(err) : resolve(ret);
      });
    });
  }
  
  // 查询单个订单 - 详细信息
  schema.statics.searchOneById = function (id, backKey) {
    const _this = this;

    return new Promise(function (resolve, reject) {
      _this
        .aggregate([
          {
            // 关联表
            $lookup: {
              // 表明
              from: "orderProduct",
              // 本表需要关联的字段
              localField: "_id",
              // 被关联表需要关联的字段
              foreignField: "order_id",
              // 结果集别名
              as: "order_product"
            }
          }, 
          {
             // 关联表
             $lookup: {
              // 表明
              from: "address",
              // 本表需要关联的字段
              localField: "consignees_id",
              // 被关联表需要关联的字段
              foreignField: "_id",
              // 结果集别名
              as: "order_consignees"
            }
          },
          {
            // 查询条件
            $match: {
              _id: mongoose.Types.ObjectId(id)
            }
          }, 
          {
            // 指定返回字段
            $project: backKey
          }
        ])
        .exec((err, ret) => {
          // 处理结果
          console.log('===处理结果===');
          console.log(JSON.stringify(ret));
          if (ret && ret.length > 0) {
            ret = ret[0];
            console.log('===1===');
            console.log(JSON.stringify(ret));
            if (ret.order_consignees && ret.order_consignees.length > 0) {
              ret.order_consignees = ret.order_consignees[0];
              console.log('===2===');
              console.log(JSON.stringify(ret));
            }
          } 
          err ? reject(err) : resolve(ret);
        });
    });
  }

  // 返回model，其中order为数据库中表的名称
  return mongoose.model('Order', schema, 'order');
}