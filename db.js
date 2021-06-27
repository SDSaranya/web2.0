const mysql = require('mysql');
const db_config = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'webapp'
}

var connection;

function handleDisconnect(){
   connection = mysql.createConnection(db_config);
    connection.connect(function(err) {
        if(err){
            console.log('DB connection error', err)
            setTimeout(handleDisconnect(), 2000);
        }
    });

    connection.on('error', function(error) {
        if(error.code == 'PROTOCOL_CONNECTION_LOST'){
            console.log('DB connection error', err)
            handleDisconnect();
        } else{
            console.log('saraaaaaaaaaa')
            throw err;
        }
    })
};

handleDisconnect();

module.exports =  connection;