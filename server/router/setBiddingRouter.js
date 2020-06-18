const express = require('express');
const router = express.Router();
const { setBiddingController } = require('../controller');
const {
    getSubmissionAuct,
    confirmSubmission,
    rejectSubmission,
    filterSubmissionByStatus
} = setBiddingController;

router.get('/get-submission-auct/:limit/:offset/:orderBy', getSubmissionAuct);
router.post('/confirm-submission/:productId', confirmSubmission);
router.post('/reject-submission/:productId/:notes', rejectSubmission);
router.post('/filter-by-status/:limit/:offset/:status', filterSubmissionByStatus);

module.exports = router;