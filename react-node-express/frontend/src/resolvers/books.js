import {getBooksQuery} from '../queries/queries'

export const resolvers = {
  Mutation: {
    addBook: (_, { text }, { cache }) => {
      const previous = cache.readQuery({ getBooksQuery });
      const newBook = {
        __typename: 'Book'
      }
      const data = {
        books: previous.books.concat([newBook]),
      }
      console.log('cache', cache)
      cache.writeData({ data });
      return newBook;
    },
  }
}