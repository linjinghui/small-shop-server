'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const cuser = app.middleware.cuser();

  // 默认
  router.get('/', controller.default.index);

  // 获取验证码
  router.get('/captcha', controller.login.captcha);

  // 注册
  router.post('/regist', controller.login.regist);

  // 登录
  router.post('/login', controller.login.signin);
  
  // 上传图片
  router.post('/admin/upload/img', cuser, controller.upload.img);

  // 删除图片
  router.post('/admin/upload/delete', cuser, controller.upload.delete);
  
  // 保存商品
  router.post('/admin/product/save', cuser, controller.product.save);

  // 商品列表
  router.get('/admin/product', cuser, controller.product.list);

  // 商品详情
  router.get('/admin/product/:id', cuser, controller.product.info);
};
