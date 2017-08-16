const Mongo = require('./pool/mongo').getPool();


module.exports = async () => {
    const client = await Mongo.acquire();
    const collection = client.collection("funnys");
    let i = await collection.insertOne({name: 'one'});
    console.log(i);
    Mongo.release(client);
};