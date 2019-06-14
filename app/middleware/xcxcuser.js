/**
 * 小程序请求中间件
 */

'use strict';

const base64 = require('base-64');

module.exports = options => {

    return async function xcxcuser (ctx, next) {
        let user = ctx.session.user;
        // auth 加密规则，(new Date().getTime() + 帐号base64).replace(/4/g,'#');
        let auth = ctx.request.header.auth;
        if (!auth) {
            ctx.status = 502;
        } else if (!user) {
            auth = auth.replace(/#/g, '4').substr((new Date().getTime()+'').length);
            // 数据库获取用户信息
            await ctx.model.Person.find({account: base64.decode(auth)}).then(ret => {
                if (ret) {
                    user = ret;
                    ctx.session.user = user;
                }
            });
        } 
        
        if (user) {
            // 更新缓存时间
            ctx.session.maxAge = 1000 * 60 * 30;
            await next();
        } else {
            // 用户不存在, 无权限
            ctx.status = 401;
        }
    }
};