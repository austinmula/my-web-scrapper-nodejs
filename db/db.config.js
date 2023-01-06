const mysql = require('mysql')

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'supper',
    password: 'pass123',
    database: 'job_details',
    insecureAuth: true
})

connection.connect((err) => {
    if (err) throw err
    else {
        console.log('Connected Successfuly!');
    }
});

module.exports = connection


