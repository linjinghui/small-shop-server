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
      return await ctx.model.Product.insert(data);
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
    return await ctx.model.Product.search(page, size, data, '-cover -label -detail -desc -person_id -update_time');
  }

  /**
	 * 查询商品详情
	 */
	async getProductInfo (data) {
    const { ctx } = this;
    return await ctx.model.Product.searchOne(data, '-person_id -create_time -update_time');
  }
  
}

module.exports = ProductService;