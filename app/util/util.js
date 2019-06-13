'use strict';

module.exports = {
    // 封装响应数据格式
    resdata (code, data) {
        return {
            code: code,
            msg: code === 200 ? 'success' : (data || ''),
            result: code === 200 ? (data || '') : '',
        };
    },
    /**
    *生成唯一ID
    */
    guid () {
        return 'xxxx-yyyy-yxxy'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
    /**
    * 去除对象中的空字段
    */
    removeEmptyKey (object) {
        // 去除空条件
        for (const key in object) {
            !object[key] && (delete object[key]);
        }
        return object;
    }
}