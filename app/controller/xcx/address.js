/** 
 * 配送地址
 */
'use strict';

const Controller = require('egg').Controller;
const util = require('../../util/util');
const Parameter = require('parameter');
const Check = new Parameter();

class AddressController extends Controller {  

  // 配送地址列表
  async list () {
    const { ctx } = this;   
    let resBody = util.resdata(200);

    await ctx.service.address.getAddressList()
    .then(ret => {
      resBody = util.resdata(200, ret);
    }, err => {
      resBody = util.resdata(503, '查询配送地址列表失败');
    });
    // 响应
    ctx.body = resBody; 
  }

  // 保存、编辑配送地址
  async save () {
    const { ctx } = this;
    let resBody = util.resdata(200);
    const rule = {
      'mobile': {type: 'string', required: true, min: 11, allowEmpty: false},
      'name': {type: 'string', required: true, min: 2, allowEmpty: false},
      'address': {type: 'string', required: true, min: 3, allowEmpty: false},
      'door_address': {type: 'string', required: true, min: 3, allowEmpty: false}
    };
    const errors = Check.validate(rule, ctx.request.body);

    if (errors == undefined) {
      await ctx.service.address.saveAddress(ctx.request.body)
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

module.exports = AddressController;
