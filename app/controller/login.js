'use strict';

const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');

class LoginController extends Controller {
  // 获取验证码
  async captcha () {
    const { ctx } = this;
    
    const options = {
      width: 100, 
      height: 24, 
      // 排除字段
      ignoreChars: '0o1i',
      // 长度
      size: 6,
      fontSize: 50, 
      color: true,
      background: '#ddd',
      // 干扰线数
      noise: 3
    } 

    // 生成验证码
    const Captcha = svgCaptcha.createMathExpr(options);

    // 把验证码保存到session
    ctx.session.captcha = Captcha.text;
    // 设置session过期时间 
    ctx.session.maxAge = 1000 * 60 * 10;
    // 响应
    ctx.response.type = 'image/svg+xml';
    ctx.body = Captcha.data;
  }

  // 登录
  async signin () {
    const { ctx } = this;

    ctx.body = {
      code: 200,
      msg: '',
      result: '123'
    };
  }
}

module.exports = LoginController;
