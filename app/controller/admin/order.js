/** 订单 */
'use strict';

const util = require('../../util/util');
const Controller = require('egg').Controller;

class OrderController extends Controller {  
  
  // 订单列表
  async list () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.order.getOrderListByAdmin(ctx.query)
    .then(ret => {
      resBody = util.resdata(200, ret);
    }, err => {
      resBody = util.resdata(201, err);
    });
    // 响应
    ctx.body = resBody; 
  }
  
  // 订单详情
  async info () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.order.getOrderInfo(ctx.query)
    .then(ret => {
      resBody = util.resdata(200, ret);
    }, err => {
      resBody = util.resdata(201, err);
    });
    // 响应
    ctx.body = resBody; 
  }
  
  // 更新订单商品重量、价格
  async update () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.order.updateOrderProduct(ctx.request.body)
    .then(ret => {
      resBody = util.resdata(200, ret);
    }, err => {
      resBody = util.resdata(201, err);
    });
    // 响应
    ctx.body = resBody; 
  }
  
  // 确认订单
  async confirm () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.order.setOrderStatus(ctx.request.body._id, 2)
    .then(ret => {
      resBody = util.resdata(200, '订单确认成功');
    }, err => {
      resBody = util.resdata(201, err);
    });
    // 响应
    ctx.body = resBody; 
  }

  // 获取备货区订单列表
  async reserveList () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.order.getReserveOrderList(ctx.query)
    .then(ret => {
      resBody = util.resdata(200, ret);
    }, err => {
      resBody = util.resdata(201, err);
    });
    // 响应
    ctx.body = resBody; 
  }
  
}

module.exports = OrderController;
