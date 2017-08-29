const qiniu = require('qiniu');
const request = require('request');
const qiniuConf = require('./conf');
const UUID = require('uuid');


module.exports.saveStreamAndGetDownloadUrl = (fileUrl, prefix, filetype) => {
  return new Promise((resolve, reject) => {
    let config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z2;
    //鉴权对象
    const accessKey = qiniuConf.ak;
    const secretKey = qiniuConf.sk;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const options = {
      scope: qiniuConf.bunket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const readableStream = request(fileUrl); // 可读的流
    const key = prefix + UUID.v1() + '.' + filetype;
    formUploader.putStream(uploadToken, key, readableStream, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        reject(respErr);
      } else if (respInfo.statusCode === 200) {
        let bucketManager = new qiniu.rs.BucketManager(mac, config);
        let publicBucketDomain = qiniuConf.domain;
        let publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
        resolve({key: key, url: publicDownloadUrl});
      } else {
        reject(new Error(respBody));
      }
    });
  })
};


module.exports.deleteFile = (fileKey) => {
  return new Promise((resolve, reject) => {
    let config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z2;
    //鉴权对象
    const accessKey = qiniuConf.ak;
    const secretKey = qiniuConf.sk;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    let bucketManager = new qiniu.rs.BucketManager(mac, config);
    bucketManager.delete(qiniuConf.bunket, fileKey, (err, respBody, respInfo) => {
      if (err) {
        reject(err);
      } else if (respInfo.statusCode === 200) {
        resolve(true)
      } else {
        resolve(false);
      }
    })
  })
};


module.exports.waterMark = (key) => {
  return new Promise((resolve,reject)=>{

  })

};

