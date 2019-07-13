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

  // 设置订单状态为备货中
  async rersevering () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.order.setOrderStatus(ctx.request.body.order_ids, 3)
    .then(ret => {
      resBody = util.resdata(200, ret);
    }, err => {
      resBody = util.resdata(201, err);
    });
    // 响应
    ctx.body = resBody; 
  }

  // 设置订单状态为备货完成
  async rersevered () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.order.setOrderStatus(ctx.request.body.order_ids, 4)
    .then(ret => {
      resBody = util.resdata(200, ret);
    }, err => {
      resBody = util.resdata(201, err);
    });
    // 响应
    ctx.body = resBody; 
  }

  // 设置订单状态为分拣完成、待发货状态
  async waitfordelivery () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.order.setOrderStatus(ctx.request.body.order_ids, 5)
    .then(ret => {
      resBody = util.resdata(200, ret);
    }, err => {
      resBody = util.resdata(201, err);
    });
    // 响应
    ctx.body = resBody; 
  }

  // 设置订单状态为发货中
  async delivering () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.order.setOrderStatus(ctx.request.body.order_ids, 6)
    .then(ret => {
      resBody = util.resdata(200, ret);
    }, err => {
      resBody = util.resdata(201, err);
    });
    // 响应
    ctx.body = resBody; 
  }

  // 设置订单状态为已完成
  async finished () {
    const { ctx } = this;
    let resBody = util.resdata(200);

    await ctx.service.order.setOrderStatus(ctx.request.body.order_ids, 7)
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
