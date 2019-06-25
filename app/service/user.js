'use strict';
 
const util = require('../util/util');
const Service = require('egg').Service;
 
class UserService extends Service {
 
  // 新增用户
	async saveUser (data) {
    const { ctx } = this;

    return new Promise(function (resolve, reject) {
      // 先查询用户是否存在
      ctx.model.User.find({open_id: data.open_id, person_id: data.person_id}).then(ret => {
        if (ret) {
          // 用户存在
          resolve(ret);
        } else {
          // 用户不存在, 需要新增
          ctx.model.User.insert(data).then(ret => {
            resolve(ret);
          }, err => {
            reject(err);
          });
        }
      }, err => {
        reject(err);
      });
    });
  }
  
}

module.exports = UserService;