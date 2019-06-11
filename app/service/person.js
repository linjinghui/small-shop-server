'use strict';
 
const Service = require('egg').Service;
 
class PersonService extends Service {
 
    /**
	 * 根据ID获取单个项目
	 */
	async save (data) {
    const { ctx } = this;
		// try {
    //   console.log(JSON.stringify(data));
    //   return await ctx.model.Person.insert({
    //     // 头像
    //     avatar: data.avatar,
    //     // 手机号
    //     mobile: data.mobile,
    //     // 姓名
    //     name: data.name,
    //     // 微信ID
    //     open_id: data.open_id,
    //     // 帐号
    //     account: data.account,
    //     // 密码
    //     pwd: data.pwd,
    //     // 帐号类型 1: 商家 2: 买家
    //     type : data.type || 1
    //   });
		// } catch (err) {
		// 	ctx.body = JSON.stringify(err);
    // }
    const db = ctx.app.mongodb;
    const Person = db.collection('person');
    try {
      const info = await Person.insert({
        // 头像
        avatar: data.avatar,
        // 手机号
        mobile: data.mobile,
        // 姓名
        name: data.name,
        // 微信ID
        open_id: data.open_id,
        // 帐号
        account: data.account,
        // 密码
        pwd: data.pwd,
        // 帐号类型 1: 商家 2: 买家
        type : data.type || 1
      });
      console.log('====save database success1===');
      console.log(info);
    } catch (e) {
      console.log('====save database err1===');
    }
	}
}

module.exports = PersonService;