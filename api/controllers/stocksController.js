'use strict';
const {GetPrice} = require( "../helpers/twelveDataHelper");

function GetAllStocks() {
    try {
        let db = global.mongoClient.db('stocks');
        const collection = db.collection('stocks');
        return collection.find().toArray();
    } catch (err) {
        console.log(`Failed to retrieve stocks: ${err}`);
        return Promise.reject(err);
    }
}

function create_a_stock(req, res) {
    var new_task = new Task(req.body);
    new_task.save(function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


function read_a_stock(req, res) {
    Task.findById(req.params.taskId, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


function update_a_stock(req, res) {
    Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


function delete_a_stock(req, res) {


    Task.remove({
        _id: req.params.taskId
    }, function(err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Task successfully deleted' });
    });
};

module.exports = {delete_a_stock, update_a_stock, read_a_stock, create_a_stock, GetAllStocks};