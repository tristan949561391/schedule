const service = require('./service');
// service.saveStreamAndGetDownloadUrl("http://www.zbjuran.com/uploads/allimg/170821/15-1FR11GS6.gif", 'demo/', 'gif').then((res) => {
//   console.log(res)
// }).catch(e => {
//   console.log(e.message)
// });
service.deleteFile('5eef6257jw1eyl2r7acbsg208w06ox6p.gif').then((res) => {
  console.log(res)
}).catch(e => {
  console.log(e)
})
