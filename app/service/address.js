'use strict';
 
const Service = require('egg').Service;
 
class AddressService extends Service {
 
  // 保存、更新配送地址
	async saveAddress (data) {
    const { ctx } = this;
    if (data._id) {
      return await ctx.model.Address.update(data, ctx.session.user);
    } else {
      // 配送地址可添加个数
      const maxCount = 10;
      return new Promise(function (resolve, reject) {
        ctx.model.Address.count({'open_id': ctx.session.user.open_id})
        .then(ret => {
          if (ret < maxCount) {
            return ctx.model.Address.insert(data, ctx.session.user);
          } else {
            reject('配送地址最多' + maxCount + '个');
          }
        })
        .then(ret => {
          resolve(ret);
        })
        .catch(err => {
          reject(err);
        });  
      });
    }
  }

  // 获取配送地址列表
	async getAddressList () {
    const { ctx } = this;

    return await ctx.model.Address.search({open_id: ctx.session.user.open_id}, '-open_id -time -update_time -__v');
  }

   // 删除配送地址
	async deleteAddress (id) {
    const { ctx } = this;
    
    return await ctx.model.Address.delete(id, ctx.session.user.open_id);
  }
  
}

module.exports = AddressService;