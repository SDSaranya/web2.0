const db = require('../db');
save_user = (data) =>  new Promise((resolve, reject) => {
    console.log('sarara');
    console.log(data)
    var values = [['100', 'saranya.d.srinivasab@gmail.com'] ];
    db.query("INSERT INTO lottery_information (amount, email) Values( \'100\',\'saranya.d@gmail.com\')", function(err, results, fields){
        if(err) {
            console.log('err', err)
        } 
        resolve(results);
           
    });
});
get_total_amount = (data) => new Promise((resolve, reject) => {
    db.query("SELECT SUM(amount)  from lottery_information", function(err, results, fields){
        if(err) {
            console.log('err', err)
            reject('could not insert')
        } 
            resolve(results);
           
    });

});

module.exports = {
    save_user
}