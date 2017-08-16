const schedule = require('node-schedule');
const config = require('./../conf').funny;


module.exports = function FunnySchedule() {
    const funnyService = require('../service/funny.service');
    this.schedule = schedule.scheduleJob(config.schedule, async () => {
            await funnyService()
        }
    )
}