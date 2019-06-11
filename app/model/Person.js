/**
 * Schema.Type

    String
    Number
    Date
    Buffer
    Boolean
    Mixed
    Objectid
    Array
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const schema = new Schema({
    // 头像
    avatar: {
      type: String
    },
    // 手机号
    mobile: {
      type: String
    },
    // 姓名
    name: {
      type: String
    },
    // 微信ID
    'open_id': {
      type: String
    },
    // 帐号
    account: {
      type: String
    },
    // 密码
    pwd: {
      type: String
    },
    // 帐号类型 1: 商家 2: 买家
    type: {
      type: Number
    }
  });
  // 返回model，其中person为数据库中表的名称
  return mongoose.model('Person', schema, 'person');
}