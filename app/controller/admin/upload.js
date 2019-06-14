/** 上传文件 */
'use strict';

const util = require('../../util/util');
const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');

const uploadDirName = '/public/uploads';
let uploadPath  = path.join(__dirname, '..' + uploadDirName);

class UploadController extends Controller {  
  
  // 上传图片
  async img () {
    const { ctx } = this;   
    let resBody = util.resdata(200); 

    const stream = await ctx.getFileStream();
    let fileName = stream.filename;
    const suffix = fileName.split('.')[fileName.split('.').length - 1];

    fileName = util.guid(8) + '.' + suffix;
    const mime = stream.mime || stream.mimeType;

    if (mime.indexOf('image') === 0) {
    
      const filePath = uploadDirName + '/' + fileName;
      // `/public/uploads/${fileName}`;
      let target  = path.join(uploadPath, '/' + fileName);

      await new Promise((resolve, reject) => {
        const remoteFileStream = fs.createWriteStream(target);
        stream.pipe(remoteFileStream);
        let errFlag;
        
        remoteFileStream.on('error', err => {
          errFlag = true;
          sendToWormhole(stream);
          remoteFileStream.destroy();
          resBody = util.resdata(201, '上传失败');
          reject(err);
        });

        remoteFileStream.on('finish', async () => {
          if (errFlag) return;
          resBody = util.resdata(200, 'http://' + ctx.request.header.host + filePath);
          resolve({ fileName, url: ctx.request.header.host + filePath });
        });
      });

    } else {
      resBody = util.resdata(400, '请上传图片类型的文件');
    }
    // 响应
    ctx.body = resBody; 
  }

  // 删除图片
  async delete () {
    const { ctx } = this;
    let resBody = util.resdata(200);
    const fileUrl = ctx.request.body.url;

    await ctx.service.file.deleteFile(fileUrl)
    .then(() => {
      resBody = util.resdata(200);
    }, err => {
      resBody = util.resdata(201, err);
    });
    // 响应
    ctx.body = resBody; 
  }
}

module.exports = UploadController;
