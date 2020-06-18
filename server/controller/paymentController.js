const { dba } = require('../database');
const { uploader } = require('../helper/uploader');
const { transportAwait } = require('../helper/nodemailer');
const moment = require('moment');

module.exports = {
  AddTopup: (req, res) => {
    try {
      const path = '/slip';
      const upload = uploader(path, "PYM").fields([{ name: "slip" }]);
      upload(req, res, async (err) => {
        let { id } = req.params;
        let { nominal } = req.body;
        let { slip } = req.files;
        let time = moment().format('YYYY-MM-DD HH:mm:ss');
        const imagePath = slip ? `${path}/${slip[0].filename}` : null;
        let topupSql = `INSERT INTO transaction (buyer_id, date_of_trx, payment_to_admin, slip_image, status_trx) VALUES (${id}, '${time}', ${nominal}, '${imagePath}', 'Pending')`;
        
        await dba(topupSql);
        res.status(201).send({
          status: "Success",
          message: "Thank you! Please wait while we verify your payment max 1x24 hours"
        });
      });
    } catch(err) {
      res.status(500).send(err.message);
    }
  },
  GetTopup: async (req, res) => {
    let { limit, offset, orderBy } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM transaction`;
    let sql = `
      SELECT 
        t.trx_id,
        u.username,
        t.buyer_id,
        t.payment_to_admin AS 'amount',
        t.date_of_trx,
        t.slip_image,
        t.status_trx
      FROM transaction t
      JOIN users u ON t.buyer_id = u.user_id
      ORDER BY date_of_trx ${orderBy}
      LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      res.status(500).send(err.message);
    }
  },
  RejectTopup: async (req, res) => {
    let { trxId, notes } = req.params;
    let sql = `UPDATE transaction SET status_trx = 'Reject', notes = '${notes}' WHERE trx_id = ${trxId}`;
    try {
      await dba(sql);
      let userSql = `
        SELECT 
          u.username,
          u.email,
          t.payment_to_admin AS 'amount',
          t.date_of_trx AS 'paymentDate',
          t.slip_image,
          t.notes
        FROM transaction t
        JOIN users u ON t.buyer_id = u.user_id
        WHERE trx_id = ${trxId}`;
      let dataUser = await dba(userSql);
      let { username, email, amount, paymentDate, slip_image } = dataUser[0];
      let mailOptions = {
        from: 'Admin <arioamri@gmail.com>',
        to: email,
        subject: 'Payment Verification',
        html: `
          <p>Dear ${username},</p>
          <p>Sorry! Pembayaran Anda dengan nomor transaksi ${trxId}, nominal Top-Up senilai Rp ${amount ? amount.toLocaleString() : null} pada tanggal ${moment(paymentDate).format("Do MMMM YYYY, HH:mm:ss") + " WIB"} TIDAK VALID dikarenakan ${notes}</p>`,
        attachments: [
          {
            fileName: slip_image.split("/slip/"),
            path: `./public${slip_image}`
          } 
        ]
      };
      await transportAwait(mailOptions);
      res.status(200).send({
        status: "Rejected",
        message: "Email has sent"
      });
    } catch(err) {
      res.status(500).send(err.message);
    }
  },
  ConfirmTopup: async (req, res) => {
    let { trxId, userId, amount } = req.params;
    let sql = `UPDATE transaction SET status_trx = 'Confirm' WHERE trx_id = ${trxId}`;
    let wallet = `SELECT wallet from users WHERE user_id = ${userId}`;
    let updateWallet = `UPDATE users SET wallet = (wallet + ${amount}) WHERE user_id = ${userId}`;
    let userSql = `
        SELECT 
          u.username,
          u.email,
          t.payment_to_admin AS 'amount',
          t.date_of_trx AS 'paymentDate',
          t.slip_image,
          t.notes
        FROM transaction t
        JOIN users u ON t.buyer_id = u.user_id
        WHERE trx_id = ${trxId}`;

    try { 
      await dba(sql);
      await dba(updateWallet);
      let response = await dba(wallet);
      
      req.app.io.emit(`Wallet-${userId}`, response[0].wallet);

      let dataUser = await dba(userSql);
      let { username, email, amount, paymentDate, slip_image } = dataUser[0];
      let mailOptions = {
        from: 'Admin <arioamri@gmail.com>',
        to: email,
        subject: 'Payment Verification',
        html: `
          <p>Dear ${username},</p>
          <p>Selamat! Pembayaran Anda dengan nomor transaksi ${trxId}, nominal Top-Up senilai Rp ${amount ? amount.toLocaleString() : null} pada tanggal ${moment(paymentDate).format("Do MMMM YYYY, HH:mm:ss") + " WIB"} BERHASIL DISETUJUI</p>`,
        attachments: [
          {
            fileName: slip_image.split("/slip/"),
            path: `./public${slip_image}`
          } 
        ]
      };
      await transportAwait(mailOptions);

      return res.status(200).send({
        status: "OK",
        message: "Confirm success"
      });
    } catch(err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  },
  filterPaymentByStatus: async (req, res) => {
    let { limit, offset, status } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM transaction WHERE status_trx = '${status}'`;
    let sql = `
      SELECT 
        t.trx_id,
        u.username,
        t.buyer_id,
        t.payment_to_admin AS 'amount',
        t.date_of_trx,
        t.slip_image,
        t.status_trx
      FROM transaction t
      JOIN users u ON t.buyer_id = u.user_id
      WHERE status_trx = '${status}'
      ORDER BY date_of_trx DESC
      LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      res.status(500).send(err.message);
    }
  },
  filterByUsername: async (req, res) => {
    let { username, limit, offset } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM transaction`;
    let sql = `
    SELECT
      t.trx_id,
      u.username,
      t.buyer_id,
      t.payment_to_admin AS 'amount',
      t.date_of_trx,
      t.slip_image,
      t.status_trx
    FROM transaction t
    JOIN users u ON t.buyer_id = u.user_id
    WHERE u.username LIKE '%${username}%'
    LIMIT ${limit} OFFSET ${offset}`;
    
    try {
      let response = await dba(sql);
      let total = await dba(countSql);
      res.status(200).send({
        data: response,
        count: total[0].numRows
      })
    } catch(err) {
      res.status(500).send(err.message);
    }
  },
};