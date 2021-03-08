import {gql}              from 'apollo-boost'

export const getBooksQuery = gql`
  {
    books {
      name
      id
      genre
      author {
        id
        name
      }
    }
  }
`

export const getAuthorsQuery = gql`
{
  authors {
    name
    id
  }
}
`

export const addBookMutation = gql`
  mutation($name: String!, $genre: String!, $author: String!) {
    addBook(name: $name, genre: $genre, author: $author){
      id
      name
      genre
      author {
        id
        name
      }
    }
  }
`

export const getBookQuery = gql`
  query($id: String){
    book(id: $id){
      id
      name
      genre
      author{
        id
        name
        books{
          name
          id
        }
      }
    }
  }
`