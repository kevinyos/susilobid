const { dba } = require('../database');
const { transportAwait } = require('../helper/nodemailer');

module.exports = {
  getSubmissionAuct: async (req, res) => {
    let { limit, offset, orderBy } = req.params;
    // console.log(orderBy);
    let countSql = `SELECT COUNT(*) AS numRows FROM product`;
    let sql = `
        SELECT 
            p.product_name,
            p.product_id,
            u.username AS seller,
            p.starting_price,
            p.submission_time,
            p.product_desc,
            c.category as category,
            p.due_date,
            p.status,
            p.notes
        FROM product p
        JOIN users u ON p.seller_id = u.user_id
        JOIN category c ON p.product_category = c.id
        ORDER BY submission_time ${orderBy}
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
    };
  },
  confirmSubmission: async (req, res) => {
    let { productId } = req.params;
    let sql = `UPDATE product SET status = 'Confirm', bid_status = 1 WHERE product_id = ${productId}`;
    try {
      await dba(sql);
      let sellerSql = `
        SELECT 
          u.username AS name,
          u.email,
          p.product_name,
          p.product_desc,
          p.submission_time
        FROM product p
        JOIN users u ON p.seller_id = u.user_id
        WHERE product_id = ${productId}`;      
      let dataSeller = await dba(sellerSql);
      let { name, email, product_name, product_desc, submission_time } = dataSeller[0];
      let url = 'http://localhost:3000/';
      let mailOptions = {
        from: 'Admin <arioamri@gmail.com>',
        to: email,
        subject: 'Product Verification',
        html: `
        <p>Dear ${name},</p>
        <p>Congratulation! Pengajuan produk Anda "${product_name}"(${product_desc}) pada tanggal ${submission_time} sudah BERHASIL DISETUJUI.</p>
        <p>Silakan cek produk Anda pada halaman Susilobid melalui link berikut <a href="${url}">Here</a></p>`
      };
      await transportAwait(mailOptions);
      res.status(200).send({
        status: 'Confirmed',
        message: 'Email verification has been sent'
      });
    } catch (err) {
      // console.log('masuk catch')
      res.status(500).send(err.message);
    };
  },
  rejectSubmission: async (req, res) => {
    let {productId, notes} = req.params;
    let sql = `UPDATE product SET status = 'Reject', notes = '${notes}' WHERE product_id = ${productId}`;
    try {
      await dba(sql);
      let sellerSql = `
        SELECT 
          u.username AS name,
          u.email,
          p.product_name,
          p.product_desc,
          p.submission_time,
          p.notes
        FROM product p
        JOIN users u ON p.seller_id = u.user_id
        WHERE product_id = ${productId}`;
      let dataSeller = await dba(sellerSql);
      let { name, email, product_name, product_desc, submission_time} = dataSeller[0];
      let mailOptions = {
        from: 'Admin <arioamri@gmail.com>',
        to: email,
        subject: 'Product Verification',
        html: `
        <p>Dear ${name},</p>
        <p>Sorry! Pengajuan produk Anda "${product_name}"(${product_desc}) pada tanggal ${submission_time} TIDAK DISETUJUI dikarenakan ${notes}</p>`
      };
      await transportAwait(mailOptions);
      res.status(200).send({
        status: 'Submission Rejected',
        message: 'Email verification has been sent'
      });
    } catch(err) {
      res.status(500).send(err.message);
    };   
  },
  filterSubmissionByStatus: async (req, res) => {
    let { limit, offset, status } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = '${status}'`;
    let sql = `
      SELECT 
        p.product_name,
        p.product_id,
        u.username AS seller,
        p.starting_price,
        p.submission_time,
        p.product_desc,
        c.category as category,
        p.due_date,
        p.status,
        p.notes
      FROM product p
      JOIN users u ON p.seller_id = u.user_id
      JOIN category c ON p.product_category = c.id
      WHERE p.status = '${status}'
      ORDER BY submission_time DESC
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
    };
  }
};