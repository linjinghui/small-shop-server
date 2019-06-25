'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const cuser = app.middleware.cuser();
  const xcxcuser = app.middleware.xcxcuser();

  // 默认
  router.get('/', controller.default.index);

  // 获取验证码
  router.get('/captcha', controller.login.captcha);

  // 注册
  router.post('/regist', controller.login.regist);

  // 登录
  router.post('/login', controller.login.signin);
  
  // ======================[后台]===========================
  // 上传图片
  router.post('/admin/upload/img', cuser, controller.admin.upload.img);

  // 删除图片
  router.post('/admin/upload/delete', cuser, controller.admin.upload.delete);
  
  // 保存商品
  router.post('/admin/product/save', cuser, controller.admin.product.save);

  // 商品列表
  router.get('/admin/product', cuser, controller.admin.product.list);

  // 商品详情
  router.get('/admin/product/:id', cuser, controller.admin.product.info);
  
  // 商品状态
  router.post('/admin/product/status', cuser, controller.admin.product.status);
  
  // 商品推荐
  router.post('/admin/product/recommend', cuser, controller.admin.product.recommend);

  // ======================[小程序]===========================
  // 登录
  router.post('/client/login', controller.login.xcxsignin);

  // 商品列表
  router.get('/client/product', xcxcuser, controller.xcx.product.list);
  
  // 商品详情
  router.get('/client/product/:id', xcxcuser, controller.xcx.product.info);
  
  // 推荐商品列表
  router.get('/client/recommend', xcxcuser, controller.xcx.product.recommendList);
  
  // 配送地址列表
  router.get('/client/address', xcxcuser, controller.xcx.address.list);

  // 保存、更新配送地址
  router.post('/client/address/save', xcxcuser, controller.xcx.address.save);
  
  // 删除配送地址
  router.post('/client/address/delete', xcxcuser, controller.xcx.address.delete);
  
  // 新增订单
  router.post('/client/order/save', xcxcuser, controller.xcx.order.save);
};
