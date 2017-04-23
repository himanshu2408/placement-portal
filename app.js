//dependencies
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var reload = require('reload');


//routes
var api = require('./routes/api');


var app = express();
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function (req, res) {
    res.redirect('/api');
});
app.use('/api', api);

//creating server
var server = app.listen(app.get('port'), function () {
   console.log('server is runnning on port '+app.get('port'));
});

reload(server, app);

module.exports = app;