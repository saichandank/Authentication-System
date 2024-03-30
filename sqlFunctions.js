const mysql = require('mysql');
const config = require('./db/config');
const pool = mysql.createPool(config);

const createTable = (schema) => {
    return new Promise((resolve, reject) => {
        pool.query(schema, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

const checkRecord = (tableName, column, value) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;

        pool.query(query, [value], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.lenght ? result[0] : null);
            }
        });
    });
}

const insertRecord = (tableName, record) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ${tableName} SET ?`;
  
      pool.query(query, [record], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };


  module.exports = { createTable, checkRecord, insertRecord };