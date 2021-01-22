'use strict';

// Imports
const {GetCurrencyRates} = require("./controllers/currencyController");

const bodyParser = require('body-parser');
const express = require('express');
const httpServer = require('http');
const HttpStatus = require('literal-http-status');
const nconf = require('nconf');
const path = require('path');
const startupHelpers = require('./helpers/startup');
const {connectMongoDb} = require('./helpers/mongo');

// Routes
const stocksRoute = require('./routes/stocks');

nconf.argv({
    MONGODB_URL: {
        alias: 'mongodb-url',
        describe: 'URL for mongo database',
        demand: false
    }
})
    .env({parseValues: true})
    .defaults({
        MONGODB_URL: 'mongodb://localhost:27017'
    });

let app = express();

app.disable('etag');
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/stocks', stocksRoute);

let server = httpServer.createServer(app);
const appPort = startupHelpers.normalizePort(process.env.PORT || '6600');

app.on('mongo-ready', () => {
    GetCurrencyRates();
    server.listen(appPort);
    console.log(`The Stocks app has started on port ${appPort}`);
});

connectMongoDb().then(function (client) {
    global.mongoClient = client;
    app.emit('mongo-ready');
});

module.exports = server;