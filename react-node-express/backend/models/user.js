const mongoose  = require('mongoose')

const userSchema = mongoose.Schema({//schema 定义文档结构
  userName: {type: String, required: true},
  password: {type: String, required: true},
})
const UserModel = mongoose.model('user', userSchema)

/*
* 对外暴露两种方式
* module.exports = xxx 只能有一个
* exports.xxx = val1 //分别暴露，可以有多个
* exports.yyy = val2
* */

exports.UserModel = UserModel