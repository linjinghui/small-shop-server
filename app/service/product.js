'use strict';
 
const Service = require('egg').Service;
 
class ProductService extends Service {
 
  /**
	 * 保存商品
	 */
	async saveProduct (data) {
    const { ctx } = this;
    if (data._id) {
      return await ctx.model.Product.update(data);
    } else {
      return await ctx.model.Product.insert(data, ctx.session.user);
    }
  }

  /**
	 * 查询商品列表
	 */
	async getProductList (data) {
    const { ctx } = this;
    const page = data.page;
    const size = data.size;
    delete data.page;
    delete data.size;
    // 设置拥有者ID、状态为非删除
    data.person_id = ctx.session.user._id;
    data.status = {$ne: 3};
    return await ctx.model.Product.search(page, size, data, '-cover -label -detail -desc -person_id -update_time');
  }

  /**
	 * 查询商品详情
	 */
	async getProductInfo (data) {
    const { ctx } = this;
    return await ctx.model.Product.searchOne(data, '-person_id -create_time -update_time');
  }

  // 设置状态
  async setStatus (data) {
    const { ctx } = this;
    return await ctx.model.Product.update(data);
  }

  // 设置推荐状态
  async setRecommend (data) {
    const { ctx } = this;
    return await ctx.model.Product.update({'_id': data.id, recommend: data.recommend});
  }
  
}

module.exports = ProductService;