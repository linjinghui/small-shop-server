'use strict';

const Parameter = require('parameter');
const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');
const base64 = require('base-64');
const util = require('../util/util');
const Check = new Parameter();

class LoginController extends Controller {
  // 获取验证码
  async captcha () {
    const { ctx } = this;
    const options = {
      width: 100, 
      height: 32, 
      // 排除字段
      ignoreChars: '0o1i',
      // 长度
      size: 4,
      fontSize: 40, 
      // color: true,
      // background: '#f5f0c4',
      // 干扰线数
      noise: 1
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
    let resBody = util.resdata(200);
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
    let resBody = util.resdata(200);
    const account = ctx.request.body.account;
    const vcode = ctx.request.body.vcode;
    const pwd = ctx.request.body.pwd;
    const loginCaptcha = ctx.session.loginCaptcha;

    if (!loginCaptcha) {
      resBody = util.resdata(400, '验证码已过期');
    } else if (vcode.toLowerCase() == loginCaptcha.toLowerCase()) {
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

  // 小程序登录
  async xcxsignin () {
    const { ctx } = this;
    let resBody = util.resdata(200);
    // 小程序拥有者账号(加密的)
    let auth = ctx.request.body.auth;
    // 小程序用户code
    let code = ctx.request.body.code;
    // 商户信息
    let authInfo = '';

    const rule = {
      'auth': {type: 'string', required: true, min: 5, allowEmpty: false},
      'code': {type: 'string', required: true, min: 5, allowEmpty: false}
    };
    const errors = Check.validate(rule, ctx.request.body);

    if (errors == undefined) {
      // 解密 auth
      auth = auth.replace(/#/g, '4').substr((new Date().getTime()+'').length);
      // 获取 商户信息
      await ctx.model.Person.find({account: base64.decode(auth)})
      .then(ret => {
        authInfo = ret;
        // 获取小程序用户信息
        return ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
          method: 'GET', 
          dataType: 'json', 
          data: {
            appid: ret.appId || 'wx32656ba9761508f9',
            secret: ret.secret || 'd4988bea3e812069d09bf0f6a820f8b0',
            js_code: code,
            grant_type: 'authorization_code'
          }
        });
      })
      .then(ret => {
        if (ret.data && ret.data.openid) {
          // 存储用户信息
          ctx.service.user.saveUser({
            avatar: ctx.request.body.avatar,
            mobile: ctx.request.body.mobile,
            name: ctx.request.body.name,
            open_id: ret.data.openid,
            person_id: authInfo._id
          });
          // _id + open_id 加密返回
          const open_id = ret.data.openid;
          resBody = util.resdata(200, base64.encode(open_id + 'S4-L' + authInfo._id));
        } else {
          resBody = util.resdata(201, '小程序用户信息获取失败');  
        }
      })
      .catch(err => {
        ctx.logger.error(err);
        resBody = util.resdata(503, '数据库操作异常');
      });
      
      
      
    } else {
      // 入参基础校验异常
      resBody = util.resdata(400, '请求参数异常：' + errors[0].field + errors[0].message);
    }

    // 响应
    ctx.body = resBody; 
  }
}

module.exports = LoginController;
