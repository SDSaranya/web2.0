const db = require('../db');
save_user = (data) =>  new Promise((resolve, reject) => {
    db.query("INSERT INTO lottery_information  SET ?", [data], function(err, results, fields){
        if(err) {
            console.log('err', err);
            reject('could not insert', err);
        } 
        console.log('good', results)
        resolve(results);
           
    });
});

get_total_amount = (data) => new Promise((resolve, reject) => {
    db.query("SELECT SUM(amount) AS total_amount  from lottery_information", function(err, results, fields){
        if(err) {
            console.log('err', err)
            reject('could not insert', err);
        } 
            resolve(results);
    });

});

module.exports = {
    save_user
}