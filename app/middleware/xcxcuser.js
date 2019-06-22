/**
 * 小程序请求中间件
 */

'use strict';

const base64 = require('base-64');

module.exports = options => {

    return async function xcxcuser (ctx, next) {
        let token = ctx.request.header.token;
        if (token) {
            token = base64.decode(token).split('S4-L');
            if (token.length === 2) {
                ctx.session.user = {open_id: token[0], _id: token[1]};
                ctx.session.maxAge = 1000 * 60 * 10;
                // console.log('====1=' + JSON.stringify(ctx.session.user));
                await next();
            } else {
                ctx.status = 401;    
            }
        } else {
            ctx.status = 401;
        }        
    }
};