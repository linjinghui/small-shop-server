/**
 * 非法请求中间件
 */

'use strict';

module.exports = options => {
    return async function cuser (ctx, next) {
        const user = ctx.session.user;
        if (user) {
            // 重新设置缓存时间
            ctx.session.maxAge = 1000 * 60 * 60;
            await next();
        } else {
            ctx.status = 401;
        }
    };
};