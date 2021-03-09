const createError = require('http-errors');
const express = require('express');
const bodyParser    = require('body-parser')
const {v4: uuidv4}  = require('uuid')
const session       = require('express-session')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const router = require('./routes/index')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  )
  next()
})
app.use(
  session({
    secret:'keyboard cat',//服务端生成申明可随意写
    resave:true,//强制保存session即使他没有什么变化
    saveUninitialized:true,//强制将来初始化的session存储
    cookie:{//session是基于cookie的，所以可以在配置session的时候配置cookie|
      maxAge:1000*60,//设置过期时间
      secure:true//true的话表示只有https协议才能访问cookie
    }
  }))

app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
