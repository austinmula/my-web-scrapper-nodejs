const connection = require('../db/db.config');

exports.fetchAllJobs = (req, res) => {
    try {
        let query = "SELECT * FROM job_listings_det";
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
        let query = `SELECT * FROM job_listings_det WHERE location = "remote"`;
        connection.query(query, (error, response) => {
            if (!error) {
                res.send(response)
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

exports.fetchFullTimeJobs = (req, res) => {
    try {
        let query = `SELECT * FROM job_listings_det WHERE meta = "Full-time"`;
        connection.query(query, (error, response) => {
            if (!error) {
                res.send(response)
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

exports.fetchTodayJobs = (req, res) => {
    try {
        let query = `SELECT * FROM job_listings_det WHERE posted_at = "PostedToday"`;
        connection.query(query, (error, response) => {
            if (!error) {
                res.send(response)
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

exports.fetchByCompanyName = (req, res) => {
    try {
        let query = `SELECT * FROM job_listings_det WHERE company LIKE ? `;
        connection.query(query, ['%' + req.params.company_name + '%'], (error, response) => {
            if (!error) {
                if (response.length === 0) {
                    res.json({ msg: "No Result For Search Parameters" })
                }
                res.send(response)
                console.log(response);
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
}