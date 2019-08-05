/**
 *  定时器： 每隔1小时准点，清零一次流水号
 **/
module.exports = {
  schedule: {
    // interval: '2m', // 1 分钟间隔
    // 每1小时准点执行一次
    cron: '0 0 */1 * * *',
    type: 'all', // 指定所有的 worker 都需要执行
    immediate: true
  },
  async task(ctx) {
    // 序列表从0开始
    ctx.app.lsh = 0;
  },
};