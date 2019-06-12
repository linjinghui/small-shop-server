/**
 * 非法请求中间件
 */

'use strict';

module.exports = options => {
    return async function cuser (ctx, next) {
        console.log('===进入中间件===');
        const user = ctx.session.user;
        if (user) {
            await next();
        } else {
            ctx.status = 401;
        }
    };
};