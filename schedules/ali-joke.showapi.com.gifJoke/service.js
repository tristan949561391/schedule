const Mongo = require('../../pool/mongo');
const config = require('./config');
const HttpRequest = require('request-promise');
const TimeFormat = require('moment');
const Event = require('events');

let event = null;

module.exports = async () => {
    event = new Event.EventEmitter();
    const client = await Mongo.acquire();
    const collection = client.collection("jokes");
    await save_datasource(collection);
    Mongo.release(client);
    event.on('end', (msg) => {
        console.log('定时任务结束');
    });
    event.on('start', (msg) => {
        console.log('定时任务开始');
    });
};

async function save_datasource(collection) {
    let nowPage = 1;
    let allPages = 0;
    do {
        let data = await query_datasource(nowPage);
        if (data && 0 === data.showapi_res_code) {
            console.log("一共有" + data.showapi_res_body.allNum + "条数据", data.showapi_res_body.allPages + '页', "当前是第" + nowPage + "页");
            allPages = data.showapi_res_body.allPages;
            let isSave = await save_List(collection, data.showapi_res_body.contentlist);
            if (!isSave) {
                break;
            }
            console.log('这些包存成功')
        }
        nowPage++;
    } while (nowPage <= allPages);
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
    } catch (e) {
        return null;
    }
}

async function save_List(collection, jokerList) {
    let fcount = 0;
    for (let i in jokerList) {
        let time = new TimeFormat(jokerList[i].ct, "YYYY-MM-DD HH:mm:ss");
        let joker = new Object();
        joker.title = jokerList[i].title;
        joker.create_time = time._d;
        joker.unique = jokerList[i].img;
        joker.pics = [jokerList[i].img];
        joker.type = 3;
        let data = await collection.findOne({unique: joker.unique});
        if (data) {
            console.log('这条已经被保存了,跳过');
            fcount++;
            continue;
        }
        await collection.insertOne(joker);
    }
    if (fcount === jokerList) {
        console.log('这一页都被保存了');
        return false
    } else {
        return true;
    }
}

//查询第一条数据，获取时间

//如果时间等于上次任务的获取的最新数据的时间说明没有新数据，则不会向下执行，结束定时任务；


//如果时间大于上次任务获取的最新数据的时间，说明有新的数据，那么就更新


//（1）查询一共有多少条数据，或者多少页





