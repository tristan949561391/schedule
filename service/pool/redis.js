//--import
const GenericPool = require('generic-pool');
const RedisClient = require('redis');
const conf_redis = require('../../conf/index').redis;

const factory = {
    create: function () {
        return new Promise(function (resolve, reject) {
            const db = RedisClient.createClient(conf_redis.port, conf_redis.uri);
            db.on('connect', () => {
                resolve(db);
                console.log('create redis connect entity success')
            });
            db.on('error', (err) => {
                console.log('create redis connect entity error');
                reject(err)
            })
        })
    },
    destroy: function (db) {
        return new Promise(function (resolve) {
            db.quit();
            db.on('end', () => {
                console.log('close redis connect entity success');
                resolve();
            });
        })
    }
};

const opts = {
    max: 10, // maximum size of the pool 
    min: 2 // minimum size of the pool 
};

module.exports = GenericPool.createPool(factory, opts)
