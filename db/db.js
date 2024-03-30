const mysql = require('mysql');
const config = require('./config');

const connectdb = async () => {
    const pool = mysql.createPool(config);

    pool.getConnection((err,connection)=>{
        if (err){
            console.log(err);
            return ;
        }

        console.log("Connected to database");
        connection.release();
    });
}

module.exports = connectdb;