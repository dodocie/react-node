const express       = require('express')
const bodyParser    = require('body-parser')
const {v4: uuidv4}  = require('uuid')
const session       = require('express-session')
const {graphqlHTTP} = require('express-graphql')
const mongoose      = require('mongoose')
const cors = require('cors')

//<dbUser>:<dbPassword>@localhost:27017/test
mongoose.connect('mongodb://localhost:27017/test',
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db)=>{console.log('err: ', err)})

mongoose.connection.on('connected', ()=>console.log('we are now connected!'))
// mongoose.connection.once('open', ()=>console.log('we are now open connection to database!'))

const schema = require('./schema/schema')

const app    = express()
app.use(cors())

const router = require('./routes/index')

// app.use(bodyParser.json())
// app.use((req, res, next)=>{
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   )
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PATCH, DELETE, OPTIONS'
//   )
//   next()
// })
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

app.use(router) //not graphql

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true //开发模式下开启
}))

app.listen(5000)//start Node + express server on port 5000