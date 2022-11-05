const express = require('express');
const logger = require('morgan');
const path = require('path');
const cors = require('cors')

const indexRouter = require('./routes/index');
const productRouter = require('./routes/products');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products', productRouter);
app.get('*',(req, res) => res.sendStatus(404));

module.exports = app;
