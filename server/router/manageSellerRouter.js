const express = require('express');
const router = express.Router();
const { manageSellerController } = require('../controller');
const {
    getAllSellers,
    searchByEmail,
    banSeller,
    unbanSeller,
    filterByStatus
} = manageSellerController;

router.get('/get-sellers/:limit/:offset', getAllSellers);
router.post('/search-sellers/:email/:limit/:offset', searchByEmail);
router.post('/ban-sellers/:id', banSeller);
router.post('/unban-sellers/:id', unbanSeller);
router.get('/filter-by-status/:limit/:offset/:status', filterByStatus);

module.exports = router;