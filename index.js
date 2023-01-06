const express = require('express')
const app = express()
const fs = require('fs');
const csv = require('fast-csv');
const mysql = require('mysql')
const path = require('path')
const fileName = 'results.csv';
const connection = require('./db/db.config')

function UploadCsvDataToMySQL() {
    let stream = fs.createReadStream(fileName);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            let query = 'INSERT INTO job_listings (title, company, location) VALUES ?';
            connection.query(query, [csvData], (error, response) => {
                console.log(error || response);
            });
            fs.unlinkSync(fileName)
        });
    stream.pipe(csvStream);
}
// UploadCsvDataToMySQL()

//create connection
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
