const axios = require("axios");


async function GetPrice(code) {
    const options = {
        method: 'GET',
        url: 'https://twelve-data1.p.rapidapi.com/price',
        params: {symbol: code, outputsize: '30', format: 'json'},
        headers: {
            'x-rapidapi-key': '3d17426ca9mshee362d0bede17efp11b9bcjsnb957e8092e80',
            'x-rapidapi-host': 'twelve-data1.p.rapidapi.com'
        }
    };

    return await axios.request(options).then(function (response) {
        console.log(response.data);
        return response.data;
    }).catch(function (error) {
        console.error(error);
    });

}

module.exports = {GetPrice};



