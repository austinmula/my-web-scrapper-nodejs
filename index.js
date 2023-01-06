const express = require('express')
const app = express()
const fs = require('fs');
const csv = require('fast-csv');
const fileName = 'results.csv';
const connection = require('./db/db.config')
const PORT = process.env.PORT || 3000

app.use('/api/jobs', require('./routes/jobListingRoute'));

// picks the scrapped data from the csv file and adds to mysql db
function UploadCsvDataToMySQL() {
    if (fileName) {
        let stream = fs.createReadStream(fileName);
        let csvData = [];
        let csvStream = csv
            .parse()
            .on("data", function (data) {
                csvData.push(data);
            })
            .on("end", function () {
                let query = 'INSERT INTO job_listings_det (title, company, location, posted_at, meta) VALUES ?';
                connection.query(query, [csvData], (error, response) => {
                    console.log(error || response);
                });
                // delete csv when done
                fs.unlinkSync(fileName)
            });
        stream.pipe(csvStream);
    }
}
// UploadCsvDataToMySQL()

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
