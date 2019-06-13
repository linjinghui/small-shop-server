'use strict';
 
const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
 
class FileService extends Service {

  /**
	 * 删除文件
	 */
	async deleteFile (fileUrl) {
    const uploadDirName = 'public/uploads';
    let filePath = fileUrl;
    const spl = filePath.split(uploadDirName);

    if (spl.length > 1) {
      const fileName = spl[spl.length - 1];
      filePath = path.join(__dirname, '../' + uploadDirName + fileName);
    }

    return await new Promise((resolve, reject) => {
      // 判断文件是否存在
      const exist = fs.existsSync(filePath);
      if (exist) {
        fs.unlink(filePath, function (err) {
          err ? reject(err) : resolve();
        });
      } else {
        reject('文件不存在！');
      }
    });
	}
}

module.exports = FileService;