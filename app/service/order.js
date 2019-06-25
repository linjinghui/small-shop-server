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
        ctx.model.Order.insert({count: totalCount, money: totalMoney, consignees_id: consigneesId, open_id: ctx.session.user.open_id, remark: remark}).then(ret => {
          // 保存订单商品信息
          (specs).forEach(item => {
            item.order_id = ret._id;
          });
          ctx.model.OrderProduct.inserts(specs).then((rets) => {
            console.log('==OrderProduct.inserts==', rets);
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
  
}

module.exports = OrderService;