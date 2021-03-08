const express       = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('../schema/schema')

const fakeDbs = {
  12445: {
    userName: 'kie',
    userId: '12445'
  }
}

const root = {
  user: ()=>{
    return {
      userName: 'kie',
      userId: '12445'
    }
  },
  login: ({userId}) => {
    return fakeDbs[userId]
  },
  register: ({userId}) => {
    return fakeDbs[userId]
  }
}

const app = express()

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true //开发模式下开启
}))

app.listen(5000)