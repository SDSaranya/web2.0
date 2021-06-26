const mysql = require('mysql');
const db_config = {
    host: '127.0,.0.1',
    user: 'root',
    password: 'Srinivasan1!',
    database: 'webapp'
}

var connection;

function handleDisconnect(){
   connection = mysql.createConnection(db_config);
    connection.connect(err => {
        if(err){
            console.log('DB connection error', err)
            setTimeout(handleDisconnect(), 2000);
        }
    });

    connection.on((err){
        if(err.code == 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        } else{
            throw err;
        }
    })
};

handleDisconnect();

export default connection;