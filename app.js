var express = require('express');
var mongoose = require('mongoose');  //加载mongoose
var path = require('path');
var favicon = require('serve-favicon'); //自己做一个小图标
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');
var app = express();

//链接数据库
mongoose.connect(settings.mongodbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function() {
  console.log('MongoDB Connection Successed');
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //要看你应用中设置的静态路径是什么，是/public还是/   !!!!!一定要注意这里
app.use(express.static(path.join(__dirname, 'bootstrap')));
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db, //cookie __dirname
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, //30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.db,
    port: settings.port,
    url: 'mongodb://localhost:27000/db'  //这个地方好好研究一下
  })
}));
//加载路由
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(settings.webport, function() {
   console.log( `listening on port ${settings.webport}`);
});
module.exports = app;
