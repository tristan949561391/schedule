const config = require('./config');
const HttpRequest = require('request-promise');
const TimeFormat = require('moment');
const crypto = require('crypto');

module.exports = async (client) => {
  const collection = client.collection("jokes");
  await save_datasource(collection);
};

async function save_datasource(collection) {
  let nowPage = 1;
  let allPages = 0;
  do {
    let data = await query_datasource(nowPage, config.step);
    if (data && 0 === data.showapi_res_code) {
      console.log("一共有" + data.showapi_res_body.allNum + "条数据", data.showapi_res_body.allPages + '页', "当前是第" + nowPage + "页");
      allPages = data.showapi_res_body.allPages;
      let canNext = await save_List(collection, data.showapi_res_body.contentlist);
      if (!canNext) {
        break;
      }
    }
    nowPage++;
  } while (nowPage <= allPages);
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
async function query_datasource(pagenum, pageSize) {
  const options = {
    url: `${config.uri}?page=${pagenum}&maxResult=${pageSize}&time=1950-01-01`,
    headers: {
      "Authorization": `APPCODE ${config.AppCode}`
    }
  };
  try {
    let response = await HttpRequest(options);
    return JSON.parse(response);
  } catch (e) {
    console.log(e.message)
    return null;
  }
}



async function save_List(collection, jokerList) {
  let canNext = true;
  for (let i in jokerList) {
    const hash = crypto.createHash('md5');
    hash.update(config.uri + jokerList[i].ct + jokerList[i].title);
    let out_id = hash.digest('hex');
    let finded = await collection.findOne({out_id: out_id});
    if (finded) {
      canNext = false;
      console.log('这条数据已存在')
      break;
    }
    let time = new TimeFormat(jokerList[i].ct, "YYYY-MM-DD HH:mm:ss");
    let joker = new Object();
    joker.title = jokerList[i].title;
    joker.create_time = time._d;
    joker.text = jokerList[i].text;
    joker.pics = [];
    joker.type = 1;
    joker.out_id = out_id;
    await collection.insertOne(joker);
  }

  return canNext;
}




