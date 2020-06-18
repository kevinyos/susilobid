const express = require('express');
const router = express.Router();
const { walletController } = require('../controller');
const { getWallet } = walletController;

router.get('/get-wallet/:userId', getWallet);

module.exports = router;