const mongoose  = require('mongoose')

const Schema = mongoose.Schema

const bookSchema = new Schema({//schema 定义文档结构. 会自动创建一个id到database
  name: String,
  genre: String,
  authorId: String
})

module.exports = mongoose.model('book', bookSchema)
