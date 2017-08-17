const Mongo = require('../../pool/mongo');
const config = require('./config');
const HttpRequest = require('request-promise');
const TimeFormat = require('moment');

module.exports = async () => {
  console.log('定时任务开始');
  const client = await Mongo.acquire();
  const collection = client.collection("jokes");
  await save_datasource(collection);
  Mongo.release(client);
  console.log('定时任务结束');
};

async function save_datasource(collection) {
    let nowPage=1;
    let allPages=0;
    do{
        let data = await query_datasource(nowPage);
        if(data&&0===data.showapi_res_code){
            console.log("一共有"+data.showapi_res_body.allNum+"条数据", data.showapi_res_body.allPages+'页',"当前是第"+nowPage+"页");
            allPages= data.showapi_res_body.allPages;
            let isSave=await save_List(collection, data.showapi_res_body.contentlist);
            if(!isSave){
                break;
            }
            console.log('这些包存成功')
        }
        nowPage++;
    }while (nowPage<=allPages);
}

/**
 * 获取json数据
 * @param pagenum
 * @returns {Promise.<void>}
 */
async function query_datasource(pagenum) {
  const options = {
    url: `${config.uri}?page=${pagenum}&maxResult=${config.step}&time=1950-01-01`,
    headers: {
      "Authorization": `APPCODE ${config.AppCode}`
    }
  };
  try {
      let response = await HttpRequest(options);
      return JSON.parse(response);
  }catch (e){
      return null;
  }
}

async function save_List(collection, jokerList) {
  let fcount=0;
  for (let i in jokerList) {
    let time = new TimeFormat(jokerList[i].ct, "YYYY-MM-DD HH:mm:ss");
    let joker = new Object();
    joker.title=jokerList[i].title;
    joker.create_time = time._d;
    joker.unique = jokerList[i].img;
    joker.pics = [jokerList[i].img];
    joker.type = 2;
    let data = await collection.findOne({unique: joker.unique});
    if (data) {
      console.log('这条已经被保存了,跳过');
      fcount++;
      continue;
    }
    await collection.insertOne(joker);
  }
  if(fcount===jokerList){
      console.log('这一页都被保存了');
      return false
  }else {
      return true;
  }
}



