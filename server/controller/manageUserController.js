const { dba } = require('../database');

module.exports = {
  getAllUsers: async (req, res) => {
    let { limit, offset } = req.params;
    let totalUsers = `SELECT COUNT(*) AS numRows FROM users WHERE role_id = 2`;
    let sql = `
        SELECT 
            user_id, 
            username, 
            email, 
            address, 
            phone, 
            status 
        FROM users WHERE role_id = 2
        LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      let count = await dba(totalUsers);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch (err) {
      res.status(500).send(err.message);
    };
  },
  searchByEmail: async (req, res) => {
    // console.log(req.params)
    let { email, limit, offset } = req.params;
    let countSql = `
    SELECT COUNT(*) AS numRows
    FROM users WHERE role_id = 2 AND email LIKE '%${email}%'`;
    let sql = `
        SELECT 
            user_id, 
            username, 
            email, 
            address, 
            phone, 
            status 
        FROM users WHERE role_id = 2 AND email LIKE '%${email}%'
        LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      let total = await dba(countSql);
      res.status(200).send({
        data: response,
        count: total[0].numRows
      });
    } catch (err) {
      res.status(500).send(err.message);
    };
  },
  banUser: async (req, res) => {
    let { id } = req.params;
    // console.log(id)
    let sql = `UPDATE users SET status = 'Banned' WHERE user_id = ${id}`;
    try {
      let response = await dba(sql);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    };
  },
  unbanUser: async (req, res) => {
    let { id } = req.params;
    let sql = `UPDATE users SET status = 'Active' WHERE user_id = ${id}`;
    try {
      let response = await dba(sql);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    };
  },
  checkStatus: async (req, res) => {
    // console.log(req.params);
    let { id } = req.params;
    let sql = `SELECT status FROM users WHERE user_id = ${id}`;
    try {
      let response = await dba(sql);
      // console.log(response)
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    };
  },
  filterByStatus: async (req, res) => {
    let {limit, offset, status} = req.params;
    let totalUsers = `SELECT COUNT(*) AS numRows FROM users WHERE role_id = 2 AND status = '${status}'`;
    let sql = `
        SELECT 
            user_id, 
            username, 
            email, 
            address, 
            phone, 
            status 
        FROM users WHERE role_id = 2 AND status = '${status}'
        LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      let count = await dba(totalUsers);
      // console.log(res.data);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch (err) {
      res.status(500).send(err.message);
    };
  }
};