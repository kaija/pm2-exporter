var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cron = require('node-cron');
var lynx = require('lynx');
var os = require("os");

var scratch = require('./scratch.js');
var config = require('./config');
var routes = require('./routes/index');
var users = require('./routes/users');

if (config.schedule) {
  var metrics = new lynx(config.statsd_addr, config.statd_port);
  cron.schedule(config.schedule, function(){
    scratch.collect(function(data){
      var report = {};
      for (var i in data) {
        var m = i;
        if (config.prepend_hostname) {
          m = os.hostname() + "." + i;
        }
        report[m] = data[i] + "|g";
      }
      if (config.debug) {
        console.log(data);
      }
      metrics.send(report, 1);
    });
  });
}



var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
