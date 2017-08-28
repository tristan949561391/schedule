/**
 * import
 */
const ali_joke_showapi_gifJoke = require('./schedules/ali-joke.showapi.com.gifJoke/schedule');
const ali_joke_showapi_picJoke = require('./schedules/ali-joke.showapi.com.picJoke/schedule');
const ali_joke_showapi_textJoke = require('./schedules/ali-joke.showapi.com.textJoke/schedule');
const api_laifudao_tupian = require('./schedules/api.laifudao.com.tupian/schedule');
const api_laifudao_xiaohua = require('./schedules/api.laifudao.com.xiaohua/schedule');
const www_xxhh_com_tag_gif = require('./schedules/www.xxhh.com.tag.gif/schedule');

function start() {
  //动态图
  ali_joke_showapi_gifJoke();
  //静态图
  ali_joke_showapi_picJoke();
  //文本笑话
  ali_joke_showapi_textJoke();
  //来福岛图片
  api_laifudao_tupian();
  //来福岛笑话
  api_laifudao_xiaohua();
  //嘻嘻哈哈
  www_xxhh_com_tag_gif();
}

module.exports = start;
