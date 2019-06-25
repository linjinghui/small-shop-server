/**
 * 订单商品信息表
 */
const util = require('../util/util');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let schema = new Schema({
    // 订单ID
    "order_id": {
      type: mongoose.Types.ObjectId
    },
    // 商品ID
    "product_id": {
      type: mongoose.Types.ObjectId
    },
    // 规格ID
    "specs_id": {
      type: String
    },
    // 规格名称
    "specs_name": {
      type: String
    },
    // 折后价格
    "rprice": {
      type: Number
    },
    // 数量
    "count": {
      type: Number
    },
    // 总价
    "money": {
      type: Number
    },
    // 商品名称
    "name": {
      type: String
    },
    // 商品单价
    "price": {
      type: Number
    },
    // 折扣
    "rebate": {
      type: Number
    }
  });

  // 新增数据
  schema.statics.insert = function (data) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.create({
        // 订单ID
        order_id: mongoose.Types.ObjectId(item.order_id) || null,
        // 商品ID
        product_id: mongoose.Types.ObjectId(data.product_id) || null,
        // 规格ID
        specs_id: data.specs_id || null,
        // 规格名称
        specs_name: data.specs_name || null,
        // 折后价格
        rprice: data.rprice || null,
        // 数量
        count: data.count || null,
        // 总价
        money: data.money || null,
        // 商品名称
        name: data.name || null,
        // 商品单价
        price: data.price || null,
        // 折扣
        rebate: data.rebate || null
      }, function (err, ret) {
        if (err) {
          reject(err);
        } else {
          resolve(ret);
        }
      });
    });
  }

  // 新增多个数据
  schema.statics.inserts = function (array) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      let _arr = [];
      array.forEach(item => {
        _arr.push({
          // 订单ID
          order_id: mongoose.Types.ObjectId(item.order_id) || null,
          // 商品ID
          product_id: mongoose.Types.ObjectId(item.product_id) || null,
          // 规格ID
          specs_id: item.specs_id || null,
          // 规格名称
          specs_name: item.specs_name || null,
          // 折后价格
          rprice: item.rprice || null,
          // 数量
          count: item.count || null,
          // 总价
          money: item.money || null,
          // 商品名称
          name: item.name || null,
          // 商品单价
          price: item.price || null,
          // 折扣
          rebate: item.rebate || null
        });
      });
      _this.insertMany(_arr, function (err, ret) {
        if (err) {
          reject(err);
        } else {
          resolve(ret);
        }
      });
    });
  }

  // 返回model，其中 orderProduct 为数据库中表的名称
  return mongoose.model('OrderProduct', schema, 'orderProduct');
}