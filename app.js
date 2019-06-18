module.exports = app => {
  app.once('server', server => {
    // websocket
  });
  app.on('error', (err, ctx) => {
    // report error
  });
  app.on('request', ctx => {
    // app.config.env 环境变量 ，可以通过cmd: EGG_SERVER_ENV=xxx npm run dev 传递
    // const cquery = ctx.query;
    // const cbody = ctx.request.body;
    // 打印请求内容
    // ctx.logger.info(JSON.stringify(Object.assign(cquery, cbody)));
  });
  app.on('response', ctx => {
    // const used = Date.now() - ctx.starttime;
    ctx.logger.info('==响应内容==' + JSON.stringify(ctx.body));
  });
};