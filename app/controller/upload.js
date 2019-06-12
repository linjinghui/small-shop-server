/** 上传文件 */
'use strict';

const util = require('../util/util');
const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');

let resBody = util.resdata(200);

class UploadController extends Controller {
  
  // 上传图片
  async img () {
    const { ctx } = this;    

    const stream = await ctx.getFileStream();
    const fileName = stream.filename;
    // "image/jpeg",
    const mime = stream.mime || stream.mimeType;

    const filePath = `/public/uploads/${fileName}`;
    let target  = path.join(__dirname, `..${filePath}`);
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
        console.log('====');
        console.log(JSON.stringify(stream.fields));
        resBody = util.resdata(200, 'http://' + ctx.request.header.host + filePath);
        resolve({ fileName, url: ctx.request.header.host + filePath });
      });
    });
    // .catch(function (err, ret) {
    //   console.log('===catch===');
    //   console.log(err);
    //   console.log(ret);
    // });
    // 响应
    ctx.body = resBody; 
  }
}

module.exports = UploadController;
