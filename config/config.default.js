/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1554776021985_4543';

  // add your middleware config here
  config.middleware = [];

  // 添加view配置
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  // 表单配置
  config.multipart = {
    // 表单上传字段限制的个数
    fields: 20,
    // 文件上传的大小限制
    fileSize: '1mb',
  };

  // 数据库配置
  config.mongoose = {
    url: 'mongodb://121.40.134.40:27017/smallshop',
    options: {},
  };
  
  // add your user config here
  const userConfig = {
    myAppName: 'small-shop',
    listen: {
      port: 80,
      hostname: '127.0.0.1',
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
