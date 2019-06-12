'use strict';

const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '你好，欢迎使用小卖铺系统';
  }
}

module.exports = DefaultController;
