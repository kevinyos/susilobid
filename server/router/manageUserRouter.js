const express = require('express');
const router = express.Router();
const { manageUserController } = require('../controller');
const { 
    getAllUsers,
    searchByEmail,
    banUser,
    unbanUser,
    checkStatus,
    filterByStatus
} = manageUserController;

router.get('/get-users/:limit/:offset', getAllUsers);
router.post('/search-users/:email/:limit/:offset', searchByEmail);
router.post('/ban-users/:id', banUser);
router.post('/unban-users/:id', unbanUser);
router.get('/check-status/:id', checkStatus);
router.get('/filter-by-status/:limit/:offset/:status', filterByStatus);

module.exports = router;