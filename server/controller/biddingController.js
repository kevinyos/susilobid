const moment = require('moment');
const schedule = require('node-schedule');
const { dba } = require('../database');
const { userJoin } = require('../utils/users');
const { transportAwait } = require('../helper/nodemailer');
const { htmlToPdf } = require('../helper/createPdf');

// compile('pdf', {username: 'arioamri', email: 'arioamri@gmail.com'})
// .then(res => console.log(res))

// htmlToPdf({username: 'arioamri', email: 'arioamri@gmail.com'})
// .then(res => console.log(res))
// .catch(err => console.log(err))

module.exports = {
  getBidding: async (req, res) => {
    let { productId, limit, offset } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM bid WHERE product_id = ${productId}`;
    let maxBidSql = `SELECT offer FROM bid WHERE product_id = ${productId} ORDER BY offer DESC LIMIT 1`;
    let sql = `
      SELECT 
        u.username,
        b.offer,
        b.time
      FROM bid b
      JOIN users u ON b.bidder_id = u.user_id 
      WHERE product_id = ${productId} 
      ORDER BY b.time DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    try {
      let prevBid = await dba(maxBidSql);
      let response = await dba(sql);
      let total = await dba(countSql);

      if (prevBid.length === 0) {
        res.status(200).send({
          data: response,
          count: total[0].numRows
        });
      } else {
        res.status(200).send({
          data: response,
          count: total[0].numRows,
          highest: prevBid[0].offer
        });
      }
    } catch(err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  },
  biddingPost: async (req, res) => {
    let {productId, bidder, offer, limit, offset} = req.params;
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    let countBid = `SELECT COUNT(*) AS countBid FROM bid WHERE bidder_id = ${bidder} && product_id = ${productId}`;
    let countSql = `SELECT COUNT(*) AS numRows FROM bid WHERE bidder_id = ${bidder}`;
    let sql = `
      SELECT 
        u.username,
        b.offer,
        b.time
      FROM bid b
      JOIN users u ON b.bidder_id = u.user_id 
      WHERE product_id = ${productId} 
      ORDER BY b.time DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    let updateWallet = `UPDATE users SET wallet = (wallet - ${offer}) WHERE user_id = ${bidder}`;
    let walletSql = `SELECT wallet FROM users WHERE user_id = ${bidder}`;
    const user = userJoin(null, null, productId);
    try {
      let count = await dba(countSql);
      let bidCount = await dba(countBid);
      
      if (!count[0].numRows) {
        let postSql = `INSERT INTO bid (product_id, bidder_id, offer, count, time) VALUES (${productId}, ${bidder}, ${offer}, ${bidCount[0].countBid +1}, '${time}')`;
        await dba(postSql);
        let response = await dba(sql);
        await dba(updateWallet);
        let wallet = await dba(walletSql);
        
        req.app.io.emit(`Wallet-${bidder}`, wallet[0].wallet);
        req.app.io.to(user.room).emit('Socket', response);
        
        res.status(200).send({
          status: 'Post bidding success',
          data: response
        });
      } else {
        let postSql = `INSERT INTO bid (product_id, bidder_id, offer, count, time) VALUES (${productId}, ${bidder}, ${offer}, ${bidCount[0].countBid +1}, '${time}')`;
        await dba(postSql);
        let response = await dba(sql);
        await dba(updateWallet);
        let wallet = await dba(walletSql);

        req.app.io.emit(`Wallet-${bidder}`, wallet[0].wallet);
        req.app.io.to(user.room).emit('Socket', response);
        
        res.status(200).send({
          status: 'Post bidding success',
          data: response
        });
      };
    } catch(err) {
      res.status(500).send(err.message);
    }
  }, biddingSchedule: async (req, res) => {
    let sql = `SELECT product_id, due_date FROM product WHERE status = 'Confirm' AND bid_status = 1`;
    try {
      let get = await dba(sql);
      for (let i = 0; i < get.length; i++) {
        let times = moment(get[i].due_date).format("YYYY/MM/DD HH:mm:ss");
        let update = `UPDATE product SET bid_status = 2 WHERE product_id = ${get[i].product_id}`;
        let BuyerSql = `
          SELECT 
            u.username AS 'buyer',
            u.email AS 'buyerEmail',
            u.phone AS 'buyerPhone',
            b.offer,
            b.bidder_id,
            b.bid_id,
            c.category,
            p.product_desc,
            p.product_name,
            p.due_date
          FROM bid b
          JOIN users u ON b.bidder_id = u.user_id
          JOIN product p ON b.product_id = p.product_id
          JOIN category c ON p.product_category = c.id
          WHERE b.product_id = ${get[i].product_id} ORDER BY offer DESC LIMIT 1  
        `;
        let sellerSql = `
          SELECT 
            u.username AS 'seller',
            p.seller_id,
            u.email AS 'sellerEmail',
            u.address,
            u.phone AS 'sellerPhone'
          FROM product p
          JOIN users u ON p.seller_id = u.user_id
          WHERE p.product_id = ${get[i].product_id}`;

        schedule.scheduleJob(times, async () => { 

          await dba(update);
          console.log(`Product ${get[i].product_id} expired`);

          let buyerDetail = await dba(BuyerSql);
          let sellerDetail = await dba(sellerSql);
          let { buyer, buyerEmail, buyerPhone, offer, category, product_desc, product_name, due_date, bid_id, bidder_id } = buyerDetail[0];
          let { seller, sellerEmail, address, sellerPhone, seller_id } = sellerDetail[0];
          const invNum = 'INV-' + Math.floor(Math.random() * 1000) + Date.now();

          let pdf = await htmlToPdf({
            invNum,
            createdDate: moment(due_date).format("Do MMMM YYYY"),
            sellerName: seller,
            sellerAddress: address,
            sellerPhone: sellerPhone,
            buyerName: buyer, 
            email: buyerEmail,
            buyerPhone: buyerPhone,
            amount: offer.toLocaleString(),
            productName: product_name,
            productDesc: product_desc,
            productCategory: category
          });
          // console.log(pdf.sqlLink);

          // send email buyer
          let mailOptionBuyer = {
            from: 'Admin <arioamri@gmail.com>',
            to: buyerEmail,
            subject: 'Invoice',
            html: `
            <p>Hi, ${buyer},</p>
            <p>SELAMAT, kamu pemenang dari lelang produk ${product_name}</p>
            <p>Product detail: ${product_desc}</p>`,
            attachments : [
              {
                fileName: pdf.sqlLink.split('/invoice/'), 
                path: `./public${pdf.sqlLink}`,
                contentType: 'application/pdf'
              }
            ]
          };

          // send email seller
          let mailOptionSeller ={
            from: 'Admin <arioamri@gmail.com>',
            to: sellerEmail,
            subject: 'Invoice',
            html: `
            <p>Hi, ${seller}</p>
            <p>SELAMAT, produk lelang kamu ${product_name} telah terjual</p>
            <p>Product detail: ${product_desc}</p>`,
            attachments : [
              {
                fileName: pdf.sqlLink.split('/invoice/'), 
                path: `./public${pdf.sqlLink}`,
                contentType: 'application/pdf'
              }
            ]
          };

          await transportAwait(mailOptionBuyer);
          await transportAwait(mailOptionSeller);

          // insert into bid result table
          let totalCount = `SELECT SUM(count) AS totalCount FROM bid WHERE product_ID = ${get[i].product_id}`;
          let countBid = await dba(totalCount);

          let insertBidResult = `
            INSERT INTO bid_result (bid_id, total_count_bidding, highest_bid, winner_id, seller_id) VALUES (${bid_id}, ${countBid[0].totalCount}, ${offer}, ${bidder_id}, ${seller_id})`;
          await dba(insertBidResult);

          // insert into transaction table
          let getBidResId = `SELECT br.id AS 'bidResultId'
            FROM bid_result br
            JOIN bid b ON b.bid_id = b.bid_id
            JOIN product p ON p.product_id = b.product_id
            WHERE p.product_id = ${get[i].product_id}`;

          let bidResId = await dba(getBidResId);
          let insertTrx = `
            INSERT INTO transaction (buyer_id, seller_id, date_of_trx, payment_to_seller, payment_to_admin, bid_result_id, status_trx) VALUES (${bidder_id}, ${seller_id}, '${moment(due_date).format("YYYY-MM-DD HH:mm:ss")}', ${offer - (offer * 0.05)}, ${offer * 0.05}, ${bidResId[0].bidResultId}, 'Close')`;
          
          let trxSql = await dba(insertTrx);
          let insertInvoice = `
            INSERT INTO invoice (invoice_number, invoice_total, invoice_date, trx_id, invoice_pdf) VALUES ('${invNum}', ${offer}, '${moment(due_date).format("YYYY-MM-DD HH:mm:ss")}', ${trxSql.insertId}, '${pdf.sqlLink}')`;
            
          await dba(insertInvoice); 
        });
      };

      return res.status(200).send({
        status: 'Success',
        message: 'OK'
      });
    } catch(err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  }
};