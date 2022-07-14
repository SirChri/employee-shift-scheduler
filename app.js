var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const dipendenti = require('./routes/dipendenti')
const cliente = require('./routes/cliente')
const agenda = require('./routes/agenda')
var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dipendenti', dipendenti)
app.use('/cliente', cliente)
app.use('/agenda', agenda)

module.exports = app;