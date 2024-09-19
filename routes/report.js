const express = require('express');
const router = express.Router();
const { v7: uuidv7 } = require('uuid');
const Scanner = require('../scanWebsite');

// Store user-specific reports and statuses in memory (for demo purposes, use Redis or a database for production)
const reports = {};

// Route to start report generation
router.post('/generate-report', async (req, res) => {
    const url = req.body.url;
    const requestId = uuidv7();
    reports[requestId] = { status: 'pending', report: null };

    res.status(200).json({ requestId, message: 'Report generation started' });

    const scanner = new Scanner(url);
    const list = await scanner.scanWebsite();

    reports[requestId].status = 'ready';
    reports[requestId].report = list;
});

// Route to get report status
router.get('/report-status/:requestId', (req, res) => {
    const requestId = req.params.requestId;
    const reportData = reports[requestId];

    if (!reportData) {
        return res.status(404).json({ message: 'Invalid request ID' });
    }

    res.json({ status: reportData.status });
});

// Route to get the report
router.get('/report/:requestId', (req, res) => {
    const requestId = req.params.requestId;
    const reportData = reports[requestId];

    if (!reportData || reportData.status !== 'ready') {
        return res.status(404).json({ message: 'Report not ready' });
    }

    res.json(reportData.report);
});

module.exports = router;
