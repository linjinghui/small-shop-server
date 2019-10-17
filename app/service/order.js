'use strict';
 
const util = require('../util/util');
const Service = require('egg').Service;
 
class OrderService extends Service {
 
  // 新增订单信息
	async saveOrder (data) {
    const { ctx } = this;

    return new Promise(function (resolve, reject) {
      // 送达时间
      const arriveTime = data.arriveTime;
      // 用户备注
      const remark = data.remark;
      // 配送地址
      const consigneesId = data.consigneesId;
      // 商品
      const goods = data.goods;
      // 商品 specsId: count 对象
      let specsIdCount = {};

      // == 查询商品信息
      let condition_search_good = [];
      // 构造 查询商品信息 的条件
      (goods || []).forEach(item => {
        // 商品ID
        if (item._id) {
          specsIdCount[item.specsId] = item.count;
          condition_search_good.push({_id: item._id});
        }
      });
      if (condition_search_good.length > 0) {
        condition_search_good = {
          $or: condition_search_good
        };
      } else {
        condition_search_good = '';
      }
      ctx.model.Product.search(1, 20, condition_search_good, '-cover -label -detail -desc -person_id -update_time -__v').then(products => {
        products = products.list || [];

        // == 获取对应规格的商品信息
        let specs = [];
        (products).forEach(item => {
          // 折扣
          const rebate = item.rebate;
          // 循环规格
          (item.specs).forEach(specsInfo => {
            const specsId = specsInfo._id;
            const price = specsInfo.price;
            const stock = specsInfo.stock;
            const count = specsIdCount[specsId];
            if (count > stock) {
              // 库存不足
              reject('库存不足');
            } else if (count > 0)  {
              specs.push({
                specs_id: specsId,
                specs_name: specsInfo.name,
                rprice: util.countRprice(price, rebate),
                count: count,
                money: count * util.countRprice(price, rebate),
                product_id: item._id,
                avatar: item.avatar,
                name: item.name,
                price: price,
                rebate: rebate
              });
              specsInfo.stock -= count;
            }
          });
        });

        // == 计算商品总数、总价
        let totalCount = 0;
        let totalMoney = 0;
        (specs).forEach(item => {
          totalCount += item.count;
          totalMoney += item.money;
        });
        

        // == 保存订单
        ctx.model.Order.insert({count: totalCount, money: totalMoney.toFixed(2), consignees_id: consigneesId, person_id: ctx.session.user._id, open_id: ctx.session.user.open_id, arriveTime: arriveTime, remark: remark}).then(ret => {
          // 保存订单商品信息
          (specs).forEach(item => {
            item.person_id = ctx.session.user._id;
            item.order_id = ret._id;
          });
          ctx.model.OrderProduct.inserts(specs).then((rets) => {
            resolve(ret);
          }, err => {
            reject(err);
          });
        }, err => {
          reject(err);
        });
      }, err => {
        reject(err);
      });
    });
  }

  // 获取订单列表
	async getOrderList (data) {
    const { ctx } = this;
    const page = data.page;
    const size = data.size;
    
    return await ctx.model.Order.search(page, size, {open_id: ctx.session.user.open_id}, {
      count: 1,
      money: 1,
      reason: 1,
      arriveTime: 1,
      remark: 1,
      status: 1,
      time: 1,
      _id: 1,
      'order_product.avatar': 1,
      'order_product.name': 1,
      'order_product.specs_name': 1,
      'order_product.count': 1,
      'order_product.weight': 1
    });
  }

  // 获取备货区订单列表
	async getReserveOrderList (data) {
    const { ctx } = this;
    const page = data.page;
    const size = data.size;
    
    return await ctx.model.Order.search(page, size, {person_id: ctx.session.user._id, $or: [{status: 2}, {status: 3}]}, {
      count: 1,
      money: 1,
      reason: 1,
      arriveTime: 1,
      remark: 1,
      status: 1,
      time: 1,
      _id: 1,
      'order_product.specs_id': 1,
      'order_product.avatar': 1,
      'order_product.name': 1,
      'order_product.specs_name': 1,
      'order_product.count': 1
    });
  }

  // 获取订单列表 - 管理后台
	async getOrderListByAdmin (data) {
    const { ctx } = this;
    const page = data.page;
    const size = data.size;
    let condition = {
      person_id: ctx.session.user._id
    };
    let andArr = [];

    // id查询
    if (data.id) {
      condition._id = data.id;
    }
    // 状态条件
    if (data.status || data.status === 0) {
      condition.status = parseInt(data.status);
    } else {
      andArr.push({
        status: {'$ne': 0}
      });
    }
    // 开始时间
    if (data.startTime && parseInt(data.startTime)) {
      andArr.push({
        time: {'$gte': new Date(parseInt(data.startTime))}
      });
    }
    // 结束时间
    if (data.endTime && parseInt(data.endTime)) {
      andArr.push({
        time: {'$lt': new Date(parseInt(data.endTime))}
      });
    }
    if (andArr.length > 0) {
      condition.$and = andArr;
    }

    return await ctx.model.Order.searchSingle(page, size, condition, {
      count: 1,
      money: 1,
      // reason: 1,
      arriveTime: 1,
      remark: 1,
      status: 1,
      time: 1,
      _id: 1,
      'order_consignees.name': 1,
      'order_consignees.mobile': 1,
      'order_consignees.address': 1,
      'order_consignees.door_address': 1
    });
  }

  // 获取订单详情
	async getOrderInfo (data) {
    const { ctx } = this;
    
    return await ctx.model.Order.searchOneById(data.id, {
      order_id: 0,
      confirm_time: 0,
      consignees_id: 0,
      distribution_time: 0,
      finish_time: 0,
      prepare_time: 0,
      open_id: 0,
      // status: 0,
      __V: 0,
      'order_consignees.last_use_time': 0,
      'order_consignees.open_id': 0,
      'order_consignees.time': 0,
      'order_consignees.update_time': 0,
      'order_consignees.__V': 0,
      'order_consignees._id': 0,
      'order_product.__V': 0,
      'order_product.__v': 0,
      // 'order_product._id': 0,
      // 'order_product.order_id': 0,
      'order_product.person_id': 0,
      'order_product.product_id': 0,
      'order_product.specs_id': 0
    });
  }

  // 取消订单
	async cancelOrder (data) {
    const { ctx } = this;

    return new Promise((resolve, reject) => {
      ctx.model.Order.searchOne({_id: data._id, open_id: ctx.session.user.open_id}).then(ret => {
        if (ret) {
          // 订单状态 0: 已删除, 1：待确认，2：待备货，3：备货中，4：待分拣，5：待配送，6：配送中，7：已完成
          if (ret.status == 5) {
            reject('订单已在配送中，无法取消');  
          } else {
            ctx.model.Order.update({_id: data._id, open_id: ctx.session.user.open_id}, {status: 0}).then(ret => {
              resolve('订单取消成功');
            }, err => {
              reject(err);
            });
          }
        } else {
          reject('未找到订单');  
        }
      }, err => {
        reject(err);
      });
    });
  }

  // 删除订单
  async deleteOrder (data) {
    const { ctx } = this;

    return new Promise((resolve, reject) => {
      // 删除订单表 
      ctx.model.Order.delete(data._id, ctx.session.user.open_id)
      .then(ret => {
        if (ret) {
          // 删除订单商品表
          return ctx.model.OrderProduct.deletes({order_id: data._id});
        } else {
          reject('未找到订单');  
        }
      }, err => {
        reject(err);  
      })
      .then(ret => {
        resolve('删除订单成功');
      }, err => {
        reject(err);
      });

    });
  }

  // 更新订单商品重量、价格
  async updateOrderProduct (data) {
    const { ctx } = this;
    console.log(JSON.stringify(data));

    // data._id - 订单商品ID
    // data.order_id - 订单ID
    // data.weight
    // data.money
    // 获取订单信息

    return new Promise((resolve, reject) => {
      let totalMoney = 0;
      // ret => {}, err => {}

      // 1-更新指定订单商品
      ctx.model.OrderProduct.update({_id: data._id, person_id: ctx.session.user._id}, data)
      .then(ret => {
        return ctx.model.OrderProduct.search({order_id: data.order_id, person_id: ctx.session.user._id}, data);
      }, err => {
        reject('更新订单商品失败');
      })
      // 2-统计该订单下所有商品的总价
      .then(ret => {
        ret.forEach(item => {
          totalMoney += item.money;
        });
        return ctx.model.Order.update({_id: data.order_id, person_id: ctx.session.user._id}, {money: totalMoney});
      }, err => {
        reject('更新订单商品失败');
      })
      // 3-更新订单总金额
      .then(ret => {
        resolve('更新成功');
      }, err => {
        reject('更新订单商品失败');
      });

    });
  }

  // 设置订单状态
	async setOrderStatus (id, status) {
    const { ctx } = this;

    if (id instanceof Array) {
      return ctx.model.Order.updates({_id: {$in: id}, person_id: ctx.session.user._id}, {status: status});
    } else {
      return ctx.model.Order.update({_id: id, person_id: ctx.session.user._id}, {status: status});
    }
  }
  
}

module.exports = OrderService;