const axios = require('axios');
// get currency rates from db
// if they are out of date then re-get them

async function GetCurrencyRates() {
    try {
        let db = global.mongoClient.db('stocks');
        const collection = db.collection('currency');
        let rates =  await collection.findOne();

        let today = new Date();
        today.setDate(today.getDate()-1);
        let formatToday = today.toJSON().slice(0, 10);

        if (rates.date < formatToday) {
            let rates = await RefreshCurrencyRates();
            await StoreCurrencyRates(rates);
        }
        return rates;
    } catch (err) {
        console.log(`Failed to retrieve currency rates: ${err}`);
        return Promise.reject(err);
    }
}

async function StoreCurrencyRates(rates) {
    let db = global.mongoClient.db('stocks');
    const collection = db.collection('currency');
    await collection.deleteMany();
    await collection.insertOne(rates);
}

async function RefreshCurrencyRates() {
    const options = {
        method: 'GET',
        url: 'https://api.exchangeratesapi.io/latest?base=GBP'
    };

    return await axios.request(options).then(function (response) {
        console.log(response.data);
        return response.data;
    }).catch(function (error) {
        console.error(error);
    });
}

module.exports = {GetCurrencyRates};