/**
 * 产品表
 */
const util = require('../util/util');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  let schema = new Schema({
    // 产品名称
    name: { type: String },
    // 产品头像
    avatar: { type: String },
    // 产品轮播图 | 数组 | 图片
    cover: { type: Array },
    // 产品描述
    desc: { type: String },
    // 产品规格 | 数组 | {name:"规格名称",price:"售价","stock": 0}
    specs: { type: Array },
    // 折扣 0-10 9.5即95折
    rebate: { type: Number },
    // 产品产地
    'origin_place': { type: String },
    // 产品标签 | 数组 | {text:"标签名称",bgcolor:"red"}
    label: { type: Array },
    // 产品详情 | 数组 | 图片
    detail: { type: Array },
    // 状态 1: 已上架 2: 已下架 3: 已删除
    status: { type: Number },
    // 是否推荐商品
    recommend: { type: Boolean, default: false },
    // 拥有者ID
    'person_id': { type: mongoose.Types.ObjectId },
    // 添加时间
    'create_time': {
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
        name: data.name || null,
        // 产品头像
        avatar: data.avatar || null,
        // 产品轮播图 | 数组 | 图片
        cover: data.cover || null,
        // 产品描述
        desc: data.desc || null,
        // 产品规格 | 数组 | {name:"规格名称",price:"售价","stock": 0}
        specs: data.specs || null,
        // 折扣 0-10 9.5即95折
        rebate: data.rebate || 10,
        // 产品产地
        'origin_place': data.origin_place || null,
        // 产品标签 | 数组 | {text:"标签名称",bcolor:"red"}
        label: data.label || null,
        // 产品详情 | 数组 | 图片
        detail: data.detail || null,
        // 状态 1: 已上架 2: 已下架 3: 已删除
        status: data.status || 2,
        // 是否推荐商品
        recommend: data.recommend,
        // 拥有者ID
        'person_id': mongoose.Types.ObjectId(user._id) || null,
        // 添加时间
        'create_time': Date.now(),
        // 更新时间
        'update_time': null
      }, function (err, ret) {
        err ? reject(err) : resolve(ret);
      });
    });
  }

  // 更新数据
  schema.statics.update = function (data, user) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      data.update_time = Date.now();
      data = util.removeEmptyKey(data);
      _this.updateOne({_id: mongoose.Types.ObjectId(data._id), person_id: mongoose.Types.ObjectId(user._id)}, {$set: data})
      .exec((err, ret) => {
        err ? reject(err) : resolve(ret);
      });
    });
  }

  // 搜索数据
  schema.statics.search = function (page, size, condition, backKey) {
    const _this = this;
    page = parseInt(page) || 1;
    size = parseInt(size) || 20;

    if (condition) {
      // id转换
      if (condition._id) {
        condition._id = mongoose.Types.ObjectId(condition._id);
      }
      if (condition.person_id) {
        condition.person_id = mongoose.Types.ObjectId(condition.person_id);
      }
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

  // 按条件查询单个数据
  schema.statics.searchOne = function (condition) {
    const _this = this;
    // id转换
    if (condition._id) {
      condition._id = mongoose.Types.ObjectId(condition._id);
    }
    if (condition.person_id) {
      condition.person_id = mongoose.Types.ObjectId(condition.person_id);
    }
    return new Promise(function (resolve, reject) {
      _this.findOne(condition || {}).exec((err, ret) => {
        err ? reject(err) : resolve(ret);
      });
    });
  }

  // 返回model，其中person为数据库中表的名称
  return mongoose.model('Product', schema, 'product');
}