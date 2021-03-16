import {InMemoryCache, Reference, makeVar, gql} from '@apollo/client'

export const typeDefs = gql`
  extend type Query {
    bookList: [ID!]!
  }
`

export const bookListVar = makeVar([])
export const bookVar = makeVar({})

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        bookList: {
          read() {
            return bookListVar();
          }
        },
        book: {
          read(){
            return bookVar()
          }
        }
      }
    }
  }
});
