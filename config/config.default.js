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

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/smallshop',
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
