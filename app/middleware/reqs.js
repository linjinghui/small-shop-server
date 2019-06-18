/**
 * 请求中间件
 */

'use strict';

module.exports = options => {
    return async function reqs (ctx, next) {
        // 请求入参打印
        const cquery = ctx.query;
        const cbody = ctx.request.body;
        ctx.logger.info('==请求内容==' + JSON.stringify(Object.assign(cquery, cbody)));
        await next();
    };
};