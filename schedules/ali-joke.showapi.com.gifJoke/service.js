const Mongo = require('../../pool/mongo');
const config = require('./config');
const HttpRequest = require('request-promise');
const RequestNormal = require('request');
const TimeFormat = require('moment');
const GridFSBucket = require('mongodb').GridFSBucket;
const UUID = require('uuid');

module.exports = async () => {
  let pagenum = 1;
  const client = await Mongo.acquire();
  const collection = client.collection("funnys");
  await save_datasource(collection, pagenum);
  Mongo.release(client);
};

/**
 * 获取json数据
 * @param pagenum
 * @returns {Promise.<void>}
 */
async function query_datasource(pagenum) {
  const options = {
    url: `${config.uri}?page=${pagenum}&maxResult=20&time=2000-01-01`,
    headers: {
      "Authorization": `APPCODE ${config.AppCode}`
    }
  };
  let response = null;
  try {
    response = await HttpRequest(options);
  } catch (e) {
    throw new Error('-< request error')
  }
  let data = JSON.parse(response);
  return data.showapi_res_body;
}

async function save_datasource(collection, pagenum) {
  try {
    let data = await query_datasource(pagenum);
    console.log(data.result.allNum, data.result.allPage, data.result.pagenum);
    await save_List(collection, data.contentlist);
    if (data.contentlist.length < 50) {
      return;
    }
  } catch (e) {
    console.log(e);
    if (e.message.startsWith('-<')) {
      return;
    }
  }
  await save_datasource(collection, pagenum + 1);
}


async function save_List(collection, jokerList) {
  for (let i in jokerList) {
    let time = new TimeFormat(jokerList[i].ct, "YYYY-MM-DD HH:mm:ss");
    let joker = new Object();
    joker.create_time = time._d;
    joker.content = jokerList[i].content;
    joker.unique = jokerList[i].id;
    if (jokerList[i].pic !== '') {
      joker.pics = [jokerList[i].pic];
      joker.type = 'PIC';
    } else {
      joker.type = "TEXT"
    }
    let data = await collection.findOne({unique: joker.unique});
    if (data) {
      throw new Error('-< have saved')
    }
    await collection.insertOne(joker);
  }
}



