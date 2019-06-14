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
