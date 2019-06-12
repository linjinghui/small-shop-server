'use strict';
 
const Service = require('egg').Service;
 
class PersonService extends Service {
 
  /**
	 * 创建商户
	 */
	async createStore (data) {
    const { ctx } = this;
    // 帐号类型 1: 商家 2: 买家
    data.type = 1;
    ctx.model.Person.insert(data, (err, ret) => {
      console.log('err:' + err);
      console.log('ret:' + ret);
    });
		return true;
	}
}

module.exports = PersonService;