const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const router = express.Router();

const cors = require('cors');
const {urlencoded} = require('body-parser');

const routes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.REACT_APP_MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
    console.log('Mongoose is connected!')
});


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('tiny'))

app.use('/api',routes)

app.listen(PORT,console.log(`Server is running at ${PORT}`));
