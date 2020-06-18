const express = require("express");
const router = express.Router();
const { socketController } = require("../controller");
const {
  getConnectedUsers
} = socketController;

router.get('/get-connected-users/:productId', getConnectedUsers);

module.exports = router;