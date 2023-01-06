const connection = require('../db/db.config');

exports.fetchAllJobs = (req, res) => {
    try {
        let query = "SELECT * FROM job_listings";
        connection.query(query, (error, response) => {
            if (!error) {
                res.send(response)
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

exports.fetchRemoteJobs = (req, res) => {
    try {
        let query = `SELECT * FROM job_listings WHERE location = "remote"`;
        connection.query(query, (error, response) => {
            if (!error) {
                res.send(response)
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
}