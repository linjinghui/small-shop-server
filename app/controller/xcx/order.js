/** 
 * 配送地址
 */
'use strict';

const Controller = require('egg').Controller;
const util = require('../../util/util');
const Parameter = require('parameter');
const Check = new Parameter();

class OrderController extends Controller {  

  // 新增订单信息
  async save () {
    let resBody = util.resdata(200);
    const { ctx } = this;
    const rule = {
      'consigneesId': {type: 'string', required: true, min: 2, allowEmpty: false},
      'goods': {type: 'array', required: true, min: 1, allowEmpty: false}
    };
    const errors = Check.validate(rule, ctx.request.body);

    if (errors == undefined) {
      await ctx.service.order.saveOrder(ctx.request.body)
      .then(ret => {
        resBody = util.resdata(200, ret._id);
      }, err => {
        // '保存失败'
        resBody = util.resdata(503, err);
      });
    } else {
      // 入参基础校验异常
      resBody = util.resdata(400, '请求参数异常：' + errors[0].field + errors[0].message);
    }

    // 响应
    ctx.body = resBody; 
  }

}

module.exports = OrderController;
