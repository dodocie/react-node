const graphql = require('graphql')
const {
        GraphQLObjectType,
        GraphQLString,
        GraphQLSchema,
        GraphQLID,
        GraphQLList,
        GraphQLNonNull
      }       = graphql


const Book   = require('../models/book')
const Author = require('../models/author')
const {to} = require('../utils/index')

/*
*  author: {name: '', id: 'author_1'}
*  book: {name, genre, authorId: 'author_1', id}  id为MongoDB生成
 * */

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=>({ // 表示type User 下的 所有字段
    userName: {type: GraphQLID},
    userId: {type: GraphQLString},
    password: {type: GraphQLString}
  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent, args){
        return Author.findById(parent.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({//使用函数，和bookType互相引用就不会undfined
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    books: {
      type: new GraphQLList(BookType),
      resolve (parent, args) {
        //code to get books of the author
        return Book.find({authorId: parent.id})
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {id: {type: GraphQLID}},
      resolve (parent, args) {//args 就是上面的args
        return Book.findById(args.id)
      }
    },
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve (parent, args) {
        return Author.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return Book.find({}) //empty obj will return all matches
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        return Author.find({})
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)} //GraphQLNonNull : required arg
      },
      resolve(parent, {name}){
        let author = new Author({name})//mongodb model
        return author.save()
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        author: {type: new GraphQLNonNull(GraphQLString)}
      },
      async resolve(parent, {name, genre, author}){//这里要怎么处理？获取author，没有则新建author，拿到authorId。创建book。返回值
        const getData = () => Author.findOne({name: author}, (err, doc)=>{
          if(err || !doc){
            return Promise.reject({err: 'no data..', doc})
          }
          return Promise.resolve(doc)
        })
        const [err, oldAuthorData] = await to(getData())
        let authorId = oldAuthorData ? oldAuthorData._id : ''
        if(!oldAuthorData){
          let currAuthor = new Author({name: author})
          currAuthor.save()
          authorId = currAuthor._id
        }
        
        let book = new Book({name, genre, authorId})
        console.log('book', book)
        return book.save()
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
