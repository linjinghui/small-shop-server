'use strict';

const Parameter = require('parameter');
const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');
const util = require('../util/util');
const Check = new Parameter();
let resBody = util.resdata(200);

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
      size: 4,
      fontSize: 50, 
      color: true,
      background: '#ddd',
      // 干扰线数
      noise: 3
    } 
    const type = ctx.query.type || 1;
    let captcha = '';
    if (type == 1) {
      // 登录验证码
      captcha = svgCaptcha.create(options);
      // 把验证码保存到session
      ctx.session.loginCaptcha = captcha.text;
    } else {
      // 注册验证码
      captcha = svgCaptcha.createMathExpr(options);
      // 把验证码保存到session
      ctx.session.registCaptcha = captcha.text;
    }
    // 设置session过期时间 
    ctx.session.maxAge = 1000 * 60 * 10;
    // 响应
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }

  // 注册
  async regist () {
    const { ctx } = this;
    const vcode = ctx.request.body.vcode;
    const registCaptcha = ctx.session.registCaptcha;
    const rule = {
      'account': {type: 'string', required: true, min: 3, allowEmpty: false}
    };
    const errors = Check.validate(rule, ctx.request.body);

    if (errors == undefined) {
      if (vcode !== registCaptcha) {
        resBody = util.resdata(400, '验证码不正确');
      } else {
        const ret = await ctx.service.person.createStore(ctx.request.body);
        if (!ret) {
          resBody = util.resdata(503, '注册用户失败');
        }
      }
    } else {
      // 入参基础校验异常
      resBody = util.resdata(400, '请求参数异常：' + errors[0].field + errors[0].message);
    }

    // 响应
    ctx.body = resBody; 
  }

  // 登录
  async signin () {
    const { ctx } = this;
    const account = ctx.request.body.account;
    const vcode = ctx.request.body.vcode;
    const pwd = ctx.request.body.pwd;
    const loginCaptcha = ctx.session.loginCaptcha;

    if (vcode.toLowerCase() == loginCaptcha.toLowerCase()) {
      await ctx.service.person.checkLoginAccount(account, pwd).then(function (ret) {
        if (ret) {
          // 把登录用户信息保存到session
          ctx.session.user = ret;
          // 设置session过期时间 * 30min
          ctx.session.maxAge = 1000 * 60 * 30;
          resBody = util.resdata(200, {name: ret.name, avatar: ret.avatar});
        } else {
          resBody = util.resdata(201, '用户不存在！');
        }
      }, function (err) {
        resBody = util.resdata(503, err);
      });
    } else {
      resBody = util.resdata(400, '验证码不正确');
    }

    // 响应
    ctx.body = resBody; 
  }
}

module.exports = LoginController;
