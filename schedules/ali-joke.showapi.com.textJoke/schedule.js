const schedule = require('node-schedule');
const config = require('./config');
const Service = require('./service');
const Mongo = require('../../pool/mongo');
const moment = require('moment');


module.exports = () => {
  let job = schedule.scheduleJob(config.schedule, async () => {
      console.log('ali-joke.showapi.com.textJoke 获取text任务开始', moment(new Date()).format('MM-DD HH:mm'));
      const client = await Mongo.acquire();
      try {
        await Service(client);
      } catch (e) {
        console.log(e)
      } finally {
        Mongo.release(client);
        console.log('ali-joke.showapi.com.textJoke 获取text任务结束', moment(new Date()).format('MM-DD HH:mm'));
      }
    }
  );
};



