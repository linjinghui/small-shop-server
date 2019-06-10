module.exports = app => {
  app.once('server', server => {
    // websocket
  });
  app.on('error', (err, ctx) => {
    // report error
  });
  app.on('request', ctx => {
    // log receive request
    console.log('=======request======' + app.config.env);
    // app.config.env 环境变量 ，可以通过cmd: EGG_SERVER_ENV=xxx npm run dev 传递
  });
  app.on('response', ctx => {
    // ctx.starttime is set by framework
    const used = Date.now() - ctx.starttime;
    // log total cost
    console.log('=======response======' + used);
  });
};