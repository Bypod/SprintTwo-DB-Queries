const dal = require('./db')

var getAllCars = function() {
    return new Promise(function(resolve, reject) {
        const sql = "SELECT * FROM cars_vw";
        dal.query(sql, [], (err, result) => {
        if (err) {
            reject(err);
            } else {
            resolve(result.rows);
            }
        }); 
    });
}

var getFilteredCars = function(input, filter) {

    if(filter == 'select'){
        console.log('filter undefined')
        return new Promise(function(resolve, reject) {
            const sql = `SELECT * FROM cars_vw`
            dal.query(sql, [], (err, result) => {
            if (err) {
                reject(err);
                } else {
                resolve(result.rows);
                }
            }); 
        });
    } else {
        return new Promise(function(resolve, reject) {
            const sql = `SELECT * FROM cars_vw WHERE ${filter} = '${input}'`
            dal.query(sql, [], (err, result) => {
            if (err) {
                reject(err);
                } else {
                resolve(result.rows);
                }
            }); 
        });
    }   
}

module.exports = {
    getAllCars,
    getFilteredCars,
}