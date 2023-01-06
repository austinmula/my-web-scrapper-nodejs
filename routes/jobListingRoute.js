const router = require('express').Router();

const {
    fetchAllJobs, fetchRemoteJobs
} = require('../controllers/job.controller');


router.get('/', fetchAllJobs);
router.get('/remote', fetchRemoteJobs);

module.exports = router;