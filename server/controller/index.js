const authController = require('./authController');
const manageUserController = require('./manageUserController');
const manageSellerController = require('./manageSellerController');
const setBiddingController = require('./setBiddingController');
const productController = require('./productController');
const socketController = require('./socketController');
const biddingController = require('./biddingController');
const paymentController = require('./paymentController');
const walletController = require('./walletController');

module.exports = {
    authController,
    manageUserController,
    manageSellerController,
    setBiddingController,
    productController,
    socketController,
    biddingController,
    paymentController,
    walletController
};