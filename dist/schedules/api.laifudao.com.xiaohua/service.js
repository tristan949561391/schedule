const config = require('./config');
const HttpRequest = require('request-promise');
const TimeFormat = require('moment');
const crypto = require('crypto');

module.exports = async (client) => {
  const collection = client.collection("jokes");
  await save_datasource(collection);
};

async function save_datasource(collection) {
  let data = await query_datasource();
  if (data && data.result.length > 0) {
    console.log("一共有" + data.result.length + "条数据");
    await save_List(collection, data.result);
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
    url: `${config.uri}`,
  };
  try {
    let response = await HttpRequest(options);
    console.log(response.length)
    response = response.substr(1, response.length);
    console.log(response.length)
    let res = {result: JSON.parse(response)}
    return res;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

async function save_List(collection, jokerList) {
  for (let i in jokerList) {
    const hash = crypto.createHash('md5');
    hash.update(config.uri + jokerList[i].url);
    let out_id = hash.digest('hex');
    let finded = await collection.findOne({out_id: out_id});
    if (finded) {
      console.log('这条数据已存在')
      break;
    }
    let joker = new Object();
    joker.title = jokerList[i].title;
    joker.create_time = new Date();
    joker.text = jokerList[i].content;
    if (jokerList[i].poster) {
      joker.pics = [jokerList[i].poster]
      joker.type = 2;
    } else {
      joker.pics = [];
      joker.type = 1;
    }
    joker.out_id = out_id;
    await collection.insertOne(joker);
    console.log("save one id is ",out_id)
  }
}




