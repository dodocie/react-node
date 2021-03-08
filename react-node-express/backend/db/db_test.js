const md5 = require('blueimp-md5')
/*
* 测试使用mongoose操作MongoDB数据库
* */
const mongoose  = require('mongoose')

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true }, (err, db)=>{

}) //mongodb://localhost:27017/dbName  mongodb-协议名 27017端口号。除了dbName，前面是固定的
const db = mongoose.connection;
db.on('connected', ()=>console.log('we are now connected!'))

//mongoose中能够操作数据的是model，model需要使用Schema生成，Schema定义collection字段，数据类型等
const userSchema = mongoose.Schema({//schema 定义文档结构
  userName: {type: String, required: true},
  password: {type: String, required: true},
})

/*
* Models 是从 Schema 编译来的构造函数. 第一个参数是跟 model 对应的集合（ collection ）名字的 单数 形式。
* .model() 这个函数是对 schema 做了拷贝（生成了 model）
* model 是通过调用 mongoose.model() 生成的，它将使用 mongoose 的默认连接。这句话怎么理解？
* 在 MongoDB 中，你不需要创建集合。当你插入一些文档时，MongoDB 会自动创建集合。
* */
const UserModel = mongoose.model('user', userSchema)//集合名字：users 执行时

//增删改查
function testFindOne(userName) {
  let currUser
  //查一个
  UserModel.findOne({userName}, (err, user)=>{
    //...传入 callback 参数，操作会被立即执行，查询结果被传给回调函数（ callback ）。
    currUser = user
    console.log('user', user)
  })
  
  console.log(currUser)
  // const query = UserModel.findOne({userName})
  // 不传 callback 参数，Query 的一个实例（一个 query 对象）被返回，这个 query 提供了构建查询器的特殊接口。
  // console.log(query)
}

function testSave({userName, password}) {
  const userModel = new UserModel({userName, password: md5(password)})
  userModel.save((err, userDoc) => {
    if(err) return
    console.log(err, userDoc)
    //...
  })
}

function testFindAndUpdate({userName, password}) {
  UserModel.findOneAndUpdate({userName}, {password: md5(password)}, {new: true, useFindAndModify: false}, (err, user)=>{
    console.log(user)//option: new: true - 返回的user是更新后的数据。
  })
}
// testFindAndUpdate({userName: 'lin', password: 'lin001'})

function testDelete(userName) {
  UserModel.remove({userName}), (err, result)=>{
    console.log(result)//{n: 1, ok: 1} n-表示删除1条数据，ok:1 表示成功。n：0 表示删除0条数据。（要删除的数据不存在）
  }
}