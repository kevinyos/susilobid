const { db, dba } = require('../database');
const Crypto = require('crypto');
const { createJWTToken } = require('../helper/jwt');
const { transporter, transportAwait } = require('../helper/nodemailer');

module.exports = {
  Register: (req, res) => {
    let { username, email, password, address, phone } = req.body;
    let hashPassword = Crypto.createHmac('sha256', 'kuncirahasia').update(password).digest('hex');
    //console.log(hashPassword)
    let sql = `INSERT INTO users (role_id, verification_id, username, email, password, address, phone) VALUES (2, 0, '${username}', '${email}', '${hashPassword}', '${address}', ${phone})`;
    db.query(sql, req.body, (err, insert) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        let sql = `SELECT * FROM users WHERE user_id = ${insert.insertId}`;
        db.query(sql, (err, results) => {
          if (err) {
            res.status(500).send({
              status: 'Failed',
              message: err.message
            });
          };
          let { username, email, password } = results[0];
          let url = `http://localhost:3000/verify?username=${username}&password=${password}`;
          let mailOptions = {
            from: 'Admin <arioamri@gmail.com>',
            to: email,
            subject: 'Email Verification',
            html: `<p>Click <a href="${url}">Here</a> to Verify your account</p>`
          };
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) res.status(500).send(err.message);
            let token = createJWTToken({ ...results[0] });
            // console.log(token)
            res.status(200).send({
              status: 'Success',
              data: {
                ...results[0],
                token
              },
              message: 'Account Created'
            });
          });
        });
      };
    });
  },
  Login: (req, res) => {
    let { username, password } = req.body;
    let hashPassword = Crypto.createHmac('sha256', 'kuncirahasia').update(password).digest('hex');
    let sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${hashPassword}'`;
    db.query(sql, (err, results) => {
      // console.log(req.body)
      // console.log(results)
      if (err) {
        res.status(500).send(err.message);
      }
      if (results.length !== 0) {
        sql += ` AND status != 'Banned'`
        db.query(sql, (err, banResult) => {
          if (err) res.status(500).send(err.message);
          if (banResult.length !== 0) {
            let token = createJWTToken({ ...results[0] });
            res.status(200).send({
              status: 'Success',
              data: {
                ...results[0],
                token
              },
              message: 'Login Succesful'
            });
          } else {
            res.status(404).send({
              status: 'Banned',
              message: 'Your account has been temporarily banned'
            });
          };
        })
      } else {
        let sqlAdmin = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        db.query(sqlAdmin, (err, result) => {
          if (err) res.status(500).send({
            status: err,
            message: 'Server down.. Please try again later'
          });
          if (result.length !== 0) {
            let token = createJWTToken({ ...result[0] });
            res.status(200).send({
              status: 'Success',
              data: {
                ...result[0],
                token
              },
              message: 'Login Succesful'
            });
          } else {
            res.status(404).send({
              status: 'Not Found',
              message: 'Username does not exist'
            });
          };
        });
      };
    });
  },
  keepLogin: (req, res) => {
    // console.log(req.user)
    res.status(200).send({
      status: 'Success',
      data: {
        ...req.user,
        token: req.token
      },
      message: 'Authorized'
    });
  },
  emailVerification: (req, res) => {
    let { username, password } = req.body;
    let sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    db.query(sql, (err, results) => {
      // console.log(results[0])
      if (err) {
        res.status(500).send({
          status: 'Error',
          message: err.message
        });
      };
      if (results.length !== 0) {
        let sql = `UPDATE users SET verification_id = 1 WHERE user_id = ${results[0].user_id}`;
        db.query(sql, (err, update) => {
          if (err) {
            res.status(500).send(err.message)
          }
          res.status(200).send({
            status: 'Updated',
            data: true,
            message: 'User Verified'
          });
        });
      } else {
        res.status(404).send({
          status: 'Not Found',
          message: 'Verification Failed'
        });
      };
    });
  }
};