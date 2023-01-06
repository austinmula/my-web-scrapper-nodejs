const router = require('express').Router();

const {
    fetchAllJobs, fetchRemoteJobs, fetchFullTimeJobs, fetchTodayJobs, fetchByCompanyName
} = require('../controllers/job.controller');


router.get('/', fetchAllJobs);
router.get('/remote', fetchRemoteJobs);
router.get('/full-time', fetchFullTimeJobs);
router.get('/jobs-today', fetchTodayJobs);
router.get('/:company_name', fetchByCompanyName);

module.exports = router;