const { dba } = require('../database');

module.exports = {
  getWallet: async (req, res) => {
    let { userId } = req.params;
    let sql = `SELECT wallet FROM users WHERE user_id = ${userId}`;
    try {
      let response = await dba(sql);
      res.status(200).send({
        status: 'Get Wallet Success',
        data: response
      });
    } catch(err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  },
};