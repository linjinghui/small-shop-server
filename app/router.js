'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/list', controller.list.list);

  // 获取验证码
  router.get('/captcha', controller.login.captcha);
  // 登录
  router.post('/login', controller.login.signin);
};
