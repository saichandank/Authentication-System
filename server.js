const express = require('express');
const dotenv = require('dotenv');
const connectdb = require('./db/db');

dotenv.config();

const cors = require('cors');
const port = process.env.PORT
const authRoutes = require('./routes/authRoutes');
const app = express(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', authRoutes)


connectdb();

app.listen(port, () => {
    console.log("Server is running on port " + port);
});


