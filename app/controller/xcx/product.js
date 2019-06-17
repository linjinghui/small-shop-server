/** 产品 */
'use strict';

const Controller = require('egg').Controller;
const util = require('../../util/util');
const Parameter = require('parameter');
const Check = new Parameter();

class ProductController extends Controller {  

  // 商品列表
  async list () {
    const { ctx } = this;   
    let resBody = util.resdata(200);
    const auth = ctx.request.header.auth;

    await ctx.service.product.getClientProductList(ctx.query.page, ctx.query.size)
    .then(ret => {
      // 处理结果
      let _list = ret.list;
      for (let i = 0;i < _list.length;i++) {
        // ===== 获取最低单价,不含无库存的
        let _specs = _list[i].specs || [];
        // 1、按单价升序
        _specs.sort(function (a, b) { return a.price > b.price });
        // 2、移除库存为0的规格
        _specs.forEach(function (item, index) { 
          if(item.stock == 0) {
            _specs.splice(index, 1);
          } else {
            // 计算折后价
            item.rprice = util.countRprice(item.price, _list[i].rebate);
          }
        });
        _list[i].specs = _specs;
      }
      ret.list = _list;
      resBody = util.resdata(200, ret);
    }, err => {
      resBody = util.resdata(503, '查询商品列表失败');
    });
    // 响应
    ctx.body = resBody; 
  }

  // 商品详情
  async info () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.product.getProductInfoById(ctx.params.id)
    .then(ret => {
      resBody = util.resdata(200, ret);
    }, err => {
      // '查询商品详情失败'
      resBody = util.resdata(503, err);
    });
    // 响应
    ctx.body = resBody;
  }

}

module.exports = ProductController;
