const qiniu = require('qiniu');
const request=require('request');


var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;

//鉴权对象
var accessKey = '65f-xBvwsecGWsUrUdU1tTGk3a0Z87LCTkyFOx0W';
var secretKey = 'jejMhQNTaImuhp5Y8GlC9v8mno6Kk3WjhOo-VTb5';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)


var options = {
  scope: "miup-public",
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);


var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
var readableStream = request('https://static.segmentfault.com/v-59a3ddde/global/img/fool/welcome@2x.png'); // 可读的流

formUploader.putStream(uploadToken, 'demo/doodle1.png', readableStream, putExtra, function (respErr,
                                                                                          respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }
  if (respInfo.statusCode == 200) {
    console.log(respBody);


    var bucketManager = new qiniu.rs.BucketManager(mac, config);
    var publicBucketDomain = 'http://if-pbl.qiniudn.com';
    var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, 'demo/doodle1.png');
    console.log(publicDownloadUrl);
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }
})
