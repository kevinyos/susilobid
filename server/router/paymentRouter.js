const express = require('express');
const router = express.Router();
const { paymentController } = require('../controller');
const {
  AddTopup,
  GetTopup,
  RejectTopup,
  ConfirmTopup,
  filterPaymentByStatus,
  filterByUsername
} = paymentController;

router.post('/topup/:id', AddTopup);
router.get('/get-topup/:limit/:offset/:orderBy', GetTopup);
router.post('/reject-topup/:trxId/:notes', RejectTopup);
router.post('/confirm-topup/:trxId/:userId/:amount', ConfirmTopup);
router.get('/filter-by-status/:limit/:offset/:status', filterPaymentByStatus);
router.get('/filter-by-username/:username/:limit/:offset', filterByUsername);

module.exports = router;