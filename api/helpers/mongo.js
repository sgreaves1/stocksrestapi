const nconf = require('nconf');
const {MongoClient} = require('mongodb');

async function connectMongoDb() {
    let mongoConnectionUri = nconf.get('MONGODB_URL');
    console.log(mongoConnectionUri);


    return Promise.resolve(MongoClient.connect(mongoConnectionUri, {poolSize: 100, useNewUrlParser: true}).then((db, error) => {
        if (error) {
            console.error('Failed to connect to mongodb, exiting');
            process.exit(2);
        }

        return db;
    }));
}

module.exports = {connectMongoDb};