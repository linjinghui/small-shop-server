'use strict';
 
const Service = require('egg').Service;
const base64 = require('base-64');
 
class PersonService extends Service {
 
  /**
	 * 创建商户
	 */
	async createStore (data) {
    const { ctx } = this;
    // 帐号类型 1: 商家 2: 买家
    data.type = 1;
    return await ctx.model.Person.insert(data);
  }

  /**
	 * 登录账户验证
	 */
	async checkLoginAccount (account, pwd) {
    const { ctx } = this;
    // 解码pwd
    return await ctx.model.Person.find({account: account, pwd: base64.decode(pwd)});
	}
}

module.exports = PersonService;