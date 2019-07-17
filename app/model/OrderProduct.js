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
      type: String
    },
    // 商品ID
    "product_id": {
      type: mongoose.Types.ObjectId
    },
    // 拥有者ID
    'person_id': { 
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
    // 实称重量
    "weight": {
      type: Number
    },
    // 总价
    "money": {
      type: Number
    },
    // 商品图片
    "avatar": {
      type: String
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
        order_id: item.order_id || null,
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
        // 实称重量
        weight: data.weight || null,
        // 总价
        money: data.money || null,
        // 商品图片
        avatar: data.avatar || null,
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
          order_id: item.order_id || null,
          // 商品ID
          product_id: mongoose.Types.ObjectId(item.product_id) || null,
          // 拥有者ID
          person_id: mongoose.Types.ObjectId(item.person_id) || null,
          // 规格ID
          specs_id: item.specs_id || null,
          // 规格名称
          specs_name: item.specs_name || null,
          // 折后价格
          rprice: item.rprice || null,
          // 数量
          count: item.count || null,
          // 实称重量
          weight: item.weight || null,
          // 总价
          money: item.money || null,
          // 商品图片
          avatar: item.avatar || null,
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

  // 删除多个数据
  schema.statics.deletes = function (condition) {
    const _this = this;
    
    // 转换对象中的ObjectId
    let parseObjectId = obj => {
      if (obj._id) {
        obj._id = mongoose.Types.ObjectId(obj._id);
      }
      if (obj.person_id) {
        obj.person_id = mongoose.Types.ObjectId(obj.person_id);
      }
      if (obj.order_id) {
        obj.order_id = obj.order_id;
      }
      if (obj.product_id) {
        obj.product_id = mongoose.Types.ObjectId(obj.product_id);
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
      _this.deleteMany(condition, function (err, ret) {
        if (err) {
          reject(err);
        } else {
          resolve(ret);
        }
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
      if (obj.order_id) {
        obj.order_id = obj.order_id;
      }
      if (obj.product_id) {
        obj.product_id = mongoose.Types.ObjectId(obj.product_id);
      }
      return obj;
    }

    if (condition) {
      condition = parseObjectId(condition);
    }

    return new Promise(function (resolve, reject) {
      let udata = {};

      // 商品数量
      if (data.count) udata.count = data.count;
      // 实称重量
      if (data.weight) udata.weight = data.weight;
      // 总价
      if (data.money) udata.money = data.money;

      _this.updateOne(condition, {$set: udata})
      .exec((err, ret) => {
        err ? reject(err) : resolve(ret);
      });
    });
  }

// 搜索数据
schema.statics.search = function (condition, backKey) {
  const _this = this;
  
  return new Promise(function (resolve, reject) {
    _this.find(condition || {}, backKey).exec((err, ret) => {
      err ? reject(err) : resolve(ret);
    });
  });
}  

  // 返回model，其中 orderProduct 为数据库中表的名称
  return mongoose.model('OrderProduct', schema, 'orderProduct');
}