const config = require('./config');
const HttpRequest = require('request-promise');
const TimeFormat = require('moment');
const crypto = require('crypto');
const cheerio = require('cheerio');

module.exports = async (client) => {
  const collection = client.collection("jokes");
  await save_datasource(collection);
};

async function save_datasource(collection) {
  let data = await query_datasource();
  if (data) {
    console.log("一共有" + data.length + "条数据");
    await save_List(collection, data);
  }
}

function query_success(data) {
  if (data && 0 === data.showapi_res_code) {
    return true;
  }
  return false;
}

/**
 * 获取json数据
 * @param pagenum
 * @returns {Promise.<void>}
 */
async function query_datasource() {
  const options = {
    url: `${config.uri}`
  };
  let resdata = new Array();
  try {
    let response = await HttpRequest(options);
    let $ = cheerio.load(response);
    $('.article').each((i, e) => {
      let title = $(e).children('pre')[0].children[0].data;
      let gif = $(e).find('img.lazyload')[0].attribs.tsrc;
      let create_time = new Date();
      resdata.push({
        title: title,
        gif: gif
      })
    });
    return resdata;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

async function save_List(collection, jokerList) {
  for (let i in jokerList) {
    let out_id = jokerList[i].gif;
    let finded = await collection.findOne({out_id: out_id});
    if (finded) {
      console.log('这条数据已存在')
      break;
    }
    let joker = new Object();
    joker.title = jokerList[i].title;
    joker.create_time = new Date();
    joker.text = jokerList[i].content;
    if (jokerList[i].gif) {
      joker.pics = [jokerList[i].gif]
      joker.type = 2;
    } else {
      joker.pics = [];
      joker.type = 1;
    }
    joker.out_id = out_id;
    await collection.insertOne(joker);
    console.log("save one id is ", out_id)
  }
}



