'use strict';
 
const util = require('../util/util');
const Service = require('egg').Service;
 
class OrderService extends Service {
 
  // 新增订单信息
	async saveOrder (data) {
    const { ctx } = this;

    return new Promise(function (resolve, reject) {
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
        ctx.model.Order.insert({count: totalCount, money: totalMoney.toFixed(2), consignees_id: consigneesId, open_id: ctx.session.user.open_id, remark: remark}).then(ret => {
          // 保存订单商品信息
          (specs).forEach(item => {
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
      remark: 1,
      status: 1,
      time: 1,
      _id: 1,
      'order_product.avatar': 1,
      'order_product.name': 1,
      'order_product.specs_name': 1,
      'order_product.count': 1
    });
  }

  // 取消订单
	async cancelOrder (data) {
    const { ctx } = this;

    return new Promise((resolve, reject) => {
      ctx.model.Order.searchOne({_id: data._id, open_id: ctx.session.user.open_id}).then(ret => {
        if (ret) {
          // 订单状态 0: 已删除, 1：待确认，2：待备货，3：待分拣，4：待配送，5：配送中，6：已完成
          if (ret.status == 5) {
            reject('订单已在配送中，无法取消');  
          } else {
            ctx.model.Order.update({_id: data._id, status: 0}, ctx.session.user).then(ret => {
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
  
}

module.exports = OrderService;