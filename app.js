var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var index = require('./routes/index');
var jobs = require('./routes/jobs');
var recruit = require('./routes/recruit');


var app = express();
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', index);
app.use('/jobs', jobs);
app.use('/recruit', recruit);


var server = app.listen(app.get('port'), function () {
   console.log('server is runnning on port '+app.get('port'));
});

module.exports = app;