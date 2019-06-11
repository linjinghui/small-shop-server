'use strict';

module.exports = {
    // 封装响应数据格式
    resdata (code, data) {
        return {
            code: code,
            msg: code === 200 ? 'success' : (data || ''),
            result: code === 200 ? (data || '') : '',
        };
    }
}