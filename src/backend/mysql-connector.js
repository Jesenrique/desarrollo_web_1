//=======[ Settings, Imports & Data ]==========================================

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'mysql-server',
    port     : '3306',
    user     : 'root',
    password : 'userpass',
    database : 'smart_home'
});

//=======[ Main module code ]==================================================
console.log("Inicio del delay");

setTimeout(() => {
    connection.connect(function(err) {
        if (err) {
            console.error('Error while connect to DB: ' + err.stack);
            return;
        }
        console.log('Connected to DB under thread ID: ' + connection.threadId);
    });;
}, 5000); // 2000 ms = 2 segundos


module.exports = connection;

//=======[ End of file ]=======================================================