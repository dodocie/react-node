const express      = require('express')
const {v4: uuidv4} = require('uuid')
const md5          = require('blueimp-md5')
const svgCaptcha   = require('svg-captcha')

const {UserModel}      = require('../models/author')
const {sessionExpired} = require('./errMsg')

const filter = {password: 0, _v: 0} //指定过滤属性
const router = express.Router()

router.get('/captcha',function (req, res) {
  const cap = svgCaptcha.create({size:4,noise:1,ignoreChars:'0o1i',background:'#DFE1CC'});

  req.session.captcha = cap.text; // session 存储
  res.type('svg')
  res.send(cap.data)
})

router.post('/register', (req, res, next) => {
  const {userName, password, verificationCode} = req.body
  
  //do sth to verify each param
  
  UserModel.findOne({userName}, (err, userDoc) => {
    if (userDoc) {
      res.send({code: 1, msg: '用户已存在'})
      return
    }
    const createTime = Date.now()
    new UserModel({userName, createTime, password: md5(password)}).save((err, user) => {
      if (!user) {
        res.send({code: 2, msg: 'unknown exception'})
        return
      }
      res.cookie('userid', user._id, {maxAge: 864000000})
      res.send({code: 0, data: {userName, id: user._id}})
    })
  })
})

router.post('/login', (req, res, next) => {
  const {userName, password, autoLogin, verificationCode} = req.body
  
  //do sth to verify each param
  
  if(autoLogin && !userName && !password){
    const userId = req.cookies.userid
    if(!userId) return res.send(sessionExpired)
    return res.send({code: 0})
  }
  UserModel.findOne({userName, password: md5(password)}, filter, (err, userDoc) => {
    //handlerErr(err)
    if (!userDoc) {
      res.send({code: 1, msg: '用户名或密码错误'})
      return
    }
    res.cookie('userid', userDoc._id, {maxAge: 864000000})
    res.send({code: 0, data: {userName: userDoc.userName, userId: userDoc._id}})
  })
})

router.post('/update', (req, res, next) => {
  const userId = req.cookies.userid
  if(!userId) return res.send(sessionExpired)
  
  const user = req.body
  UserModel.findOneAndUpdate({_id: userId}, user, {new: false, useFindAndModify: false}, (err, oldUser)=>{
    console.log(oldUser)//option: new: true - 返回的user是更新后的数据。
    if(!oldUser){
      res.clearCookie('userid')
      return res.send(sessionExpired)
    }
  
    const data = Object.assign({userId: oldUser._id, userName: oldUser.userName}, user)
    res.send({code: 0, data})
  })
})

router.get('/user', (req, res, next) => {
  const userId = req.cookies.userid
  if(!userId) return res.send(sessionExpired)
  
  UserModel.findOne({_id: userId}, filter, (err, userDoc) => {
    if (!userDoc) {
      res.send(sessionExpired)
      return
    }
    res.cookie('userid', userDoc._id, {maxAge: 864000000})
    res.send({code: 0, data: {userName: userDoc.userName, userId: userDoc._id}})
  })
})

module.exports = router