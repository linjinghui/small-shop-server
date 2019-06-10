'use strict';

const Controller = require('egg').Controller;

class ListController extends Controller {
  async list() {
    const { ctx } = this;
    const dataList = {
      list: [
        { id: 1, title: 'this is news 1', url: '/news/1' },
        { id: 2, title: 'this is news 2', url: '/news/2' }
      ]
    };
    await ctx.render('list.tpl', dataList);
  }
}

module.exports = ListController;
