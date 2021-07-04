const db = require('../db');
save_user = (data) =>  new Promise((resolve, reject) => {
    db.query("INSERT INTO lottery_information  SET ?", [data], function(err, results, fields){
        if(err) {
            console.log('err', err);
            reject('could not insert', err);
        } 
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

get_list_of_participants =(data) => new Promise((resolve, reject) => {
    db.query("SELECT email FROM lottery_information", null, function(err, results, fields){
        if(err){
            reject('could not insert', err);
        }
        resolve(results);
    });
});

delete_all_users = (data) => new Promise((resolve, reject)=> {
    db.query("DELETE FROM lottery_information where id > 0", null, function(err, results, fields){
        if(err){
            reject('could not insert', err);
        }
        resolve(results);
    });
});

module.exports = {
    save_user,
    get_list_of_participants,
    delete_all_users
}