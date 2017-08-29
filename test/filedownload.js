const request = require('request');
const fs = require('fs');
const writestream = fs.createWriteStream('doodle.png');

request('https://static.segmentfault.com/v-59a3ddde/global/img/fool/welcome@2x.png').pipe(writestream);
