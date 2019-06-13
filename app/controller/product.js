/** 产品 */
'use strict';

const util = require('../util/util');
const Controller = require('egg').Controller;

let resBody = util.resdata(200);

class ProductController extends Controller {  
  
  // 保存商品
  async save () {
    const { ctx } = this;    

    await ctx.service.product.saveProduct(ctx.request.body)
    .then(ret => {
      resBody = util.resdata(200, ret._id);
    }, err => {
      // '保存失败'
      resBody = util.resdata(503, err);
    });
    // 响应
    ctx.body = resBody; 
  }

  // 商品列表
  async list () {
    const { ctx } = this;   

    await ctx.service.product.getProductList(ctx.query)
    .then(ret => {
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

    await ctx.service.product.getProductInfo({'_id': ctx.params.id})
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
