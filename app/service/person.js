'use strict';
 
const Service = require('egg').Service;
 
class PersonService extends Service {
 
  /**
	 * 创建商户
	 */
	async createStore (data) {
    const { ctx } = this;
		return await ctx.model.Person.create({
      // 头像
      avatar: data.avatar || null,
      // 手机号
      mobile: data.mobile || null,
      // 姓名
      name: data.name || null,
      // 微信ID
      open_id: data.open_id || null,
      // 帐号
      account: data.account || null,
      // 密码
      pwd: data.pwd || null,
      // 帐号类型 1: 商家 2: 买家
      type : 1
    });
	}
}

module.exports = PersonService;