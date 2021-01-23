const {GetPrice} = require("../helpers/twelveDataHelper");
const express = require('express');
const router = express.Router();
const {GetAllStocks} = require('../controllers/stocksController');
const HttpStatus = require('literal-http-status');
const {Cashify} = require('cashify');


router.get('/', async function (request, response) {
    try {
        let stocks = await GetAllStocks();

        stocks = await getProfits(stocks);

        let invested = stocks.map(stock => stock.price * stock.quantity).reduce((a, b) => a + b);
        let totalProfit = stocks.map(stock => stock.totalProfit).reduce((a, b) => a + b);


        const cashify = new Cashify({base: 'GBP', rates: global.rates.rates});
        const totalProfits = cashify.convert(totalProfit, {from: 'USD', to: 'GBP'});

        return response.status(HttpStatus['OK']).json({
            invested,
            totalProfits
        });
    }
    catch (err) {
        console.log(err.message);
        return response.status(HttpStatus['OK']).json({});
    }
});

router.get('/all', async function (request, response) {

    let stocks = await GetAllStocks();

    stocks = await getProfits(stocks);

    return response.status(HttpStatus['OK']).json({
        stocks
    });
} );

const getProfits = (stocks) => {
    const promises = stocks.map(async stock => {
        let currentPrice = await GetPrice(stocks[0].code);
        stock.profit = currentPrice.price - stock.price;
        let payed = stock.price * stock.quantity;
        let sellFor = currentPrice.price * stock.quantity;
        stock.currentPrice = currentPrice.price;
        stock.totalProfit = sellFor - payed;
        return stock;
    });

    return Promise.all(promises);
};


// module.exports = function(app) {
//
//
//
//     app.route('/stocks')
//         .post(stocks.create_a_stock);
//
//
//     app.route('/stocks/:stockCode')
//         .get(stocks.read_a_stock)
//         .put(stocks.update_a_stock)
//         .delete(stocks.delete_a_stock);
//
//
// };

module.exports = router;
