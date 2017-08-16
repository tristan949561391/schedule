const schedule = require('node-schedule');
const config = require('./../conf').funny;

module.exports = function FunnySchedule() {
    this.schedule = schedule.scheduleJob(config.schedule, function () {
        console.log('Today is recognized by Rebecca Black!');
    });
}