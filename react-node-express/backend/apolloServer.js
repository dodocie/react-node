const {
        ApolloServer,
        gql,
        UserInputError,
        AuthenticationError
      }            = require('apollo-server')
const {RedisCache} = require('apollo-server-cache-redis')

const schema = require('./schema/schema')

const typeDefs = gql`
  type Query {
    readError: String
    authenticationError: String
  }
  type Mutation {
    userInputError(input: String): String
  }
`

const resolvers = {
  Query: {
    readError: (parent, args, context) => {
      // fs.readFileSync('/does/not/exist')
    },
    authenticationError: (parent, args, context) => {
      throw new AuthenticationError('must authenticate')
    },
  },
  Mutation: {
    userInputError: (parent, args, context, info) => {
      if (args.input !== 'expected') {
        throw new UserInputError('Form Arguments invalid', {
          invalidArgs: Object.keys(args),
        });
      }
    },
  },
}

//new ApolloError(message, code, additionalProperties) 定义其它错误

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schema,
  // cache: new RedisCache({ 注释原因：[ioredis] Unhandled error event: Error: getaddrinfo ENOTFOUND redis-server redis-server:6379 at GetAddrInfoReqWrap.onlookup [as oncomplete]
  //   host: 'redis-server',
  //   // Options are passed through to the Redis client
  // }),
  formatError(err) {
    if (err.originalError instanceof AuthenticationError) {
      return new Error('Different authentication error message!')
    }
  },
})

//为什么这个获取数据要很久很久很久。。。

server.listen(4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
});