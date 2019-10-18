'use strict';
 
const Service = require('egg').Service;
 
class ProductService extends Service {
 
  // 保存、更新商品
	async saveProduct (data) {
    const { ctx } = this;
    if (data._id) {
      return await ctx.model.Product.update(data, ctx.session.user);
    } else {
      return await ctx.model.Product.insert(data, ctx.session.user);
    }
  }

  // Admin查询商品列表
	async getProductList (data) {
    const { ctx } = this;
    const page = data.page;
    const size = data.size;
    delete data.page;
    delete data.size;
    // 设置拥有者ID、状态为非删除
    data.person_id = ctx.session.user._id;
    data.status = {$ne: 3};
    if (data.name) {
      data.name = {$regex: data.name};
    }
    return await ctx.model.Product.search(page, size, data, '-cover -label -detail -desc -person_id -update_time -__v');
  }

   // Client查询商品列表
	async getClientProductList (page, size) {
    const { ctx } = this;
    // 设置拥有者ID、状态为已上线
    const data = {
      // person_id: ctx.session.user._id,
      person_id: '5d036c8874c56aa8280dbfbb',
      status: 1
    };
    
    return await ctx.model.Product.search(page, size, data, '-cover -detail -recommend -status -person_id -create_time -update_time -__v');
  }

  // Client查询推荐商品列表
 async getRecommendList (page, size) {
   const { ctx } = this;
   // 设置拥有者ID
   const data = {
     person_id: ctx.session.user._id,
     recommend: true
   };
   
   return await ctx.model.Product.search(1, 20, data, '-cover -detail -recommend -status -person_id -create_time -update_time -__v');
 }

  // 查询商品详情
	async getProductInfoById (id) {
    const { ctx } = this;
    return await ctx.model.Product.searchOne({_id: id, person_id: ctx.session.user._id}, '-recommend -person_id -create_time -update_time -__v');
  }

  // 设置商品状态
  async setStatus (id, status) {
    const { ctx } = this;
    return await ctx.model.Product.update({_id: id, status: status}, ctx.session.user);
  }

  // 设置推荐状态
  async setRecommend (id, recommend) {
    const { ctx } = this;
    return await ctx.model.Product.update({'_id': id, recommend: recommend}, ctx.session.user);
  }
  
}

module.exports = ProductService;