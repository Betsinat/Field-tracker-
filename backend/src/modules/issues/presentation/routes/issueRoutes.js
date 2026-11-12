const express = require('express');
const { syncReports, getReports } = require('../controllers/issueController');

const router = express.Router();

router.post('/sync', syncReports);
router.get('/', getReports);

module.exports = router;
