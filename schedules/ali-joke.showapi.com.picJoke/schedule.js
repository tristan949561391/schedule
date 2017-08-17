const schedule = require('node-schedule');
const config = require('./config');
const Service = require('./service');


module.exports = () => {
  this.schedule = schedule.scheduleJob(config.schedule, async () => {
      await Service()
    }
  )
};



