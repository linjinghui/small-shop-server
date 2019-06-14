/** 产品 */
'use strict';

const Controller = require('egg').Controller;
const util = require('../../util/util');
const Parameter = require('parameter');
const Check = new Parameter();

class ProductController extends Controller {  
  
  // 保存商品
  async save () {
    const { ctx } = this;    
    let resBody = util.resdata(200);

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
    let resBody = util.resdata(200);

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

  // 商品状态修改
  async status () {
    const { ctx } = this;
    let resBody = util.resdata(200);
    const rule = {
      'status': {type: 'string',required: true, values: [1, 2, 3]}
    };
    const id = ctx.request.body.id;   
    // 状态 1: 已上架 2: 已下架 3: 已删除
    const status = ctx.request.body.status;
    const errors = Check.validate(rule, ctx.request.body);
    if (errors) {
      // 入参基础校验异常
      resBody = util.resdata(400, '请求参数异常：' + errors[0].field + ' ' + errors[0].message);
    } else {
      await ctx.service.product.setStatus(id, status)
      .then(ret => {
        resBody = util.resdata(200, '设置成功');
      }, err => {
        // '操作失败'
        resBody = util.resdata(503, err);
      });
    }

    // 响应
    ctx.body = resBody;
  }

  // 商品推荐状态修改
  async recommend () {
    const { ctx } = this;
    let resBody = util.resdata(200);
    const rule = {
      'id': {type: 'string', required: true},
      'recommend': {type: 'string', required: true, values: [true, false]}
    };
    const errors = Check.validate(rule, ctx.request.body);
    if (errors) {
      // 入参基础校验异常
      resBody = util.resdata(400, '请求参数异常：' + errors[0].field + ' ' + errors[0].message);
    } else {
      await ctx.service.product.setRecommend(ctx.request.body.id, ctx.request.body.recommend)
      .then(ret => {
        resBody = util.resdata(200, '设置成功');
      }, err => {
        // '操作失败'
        resBody = util.resdata(503, err);
      });
    }

    // 响应
    ctx.body = resBody;
  }

}

module.exports = ProductController;
