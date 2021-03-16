import React, {useState}                  from 'react'
import {useMutation, gql, useReactiveVar} from "@apollo/client"

import Form          from '../Form/form'
import {
  getAuthorsQuery,
  addBookMutation,
  getBooksQuery
}                    from '../../queries/queries'
import {bookListVar} from '../../ApolloState/cache'
import {to}          from "../../utils";

const AddBook = () => {
  const [args, setBookArgs] = useState({})
  
  const handleChange = (e, category) => {
    const val         = e.target.value
    setBookArgs(preArgs=>{
      preArgs[category] = val
      return preArgs
    })
  }
  const inputs = [
    {
      name: 'bookName',
      type: 'text',
      label: 'Book Name',
      id: 'book-name',
      changeHandler: e => handleChange(e, 'name')
    },
    {
      name: 'bookGenre',
      type: 'text',
      label: 'Book Genre',
      id: 'book-genre',
      changeHandler: e => handleChange(e, 'genre')
    },
    {
      name: 'bookAuthor',
      type: 'text',
      label: 'Book Author',
      id: 'book-author',
      changeHandler: e => handleChange(e, 'author')
    },
  ]
  
  const [addBook] = useMutation(addBookMutation, {
    update(cache, {data: {addBook}}){
      cache.modify({
        fields: {
          bookList(oldBookRefs = [], {readField}){
            console.log('readField', oldBookRefs, readField)
            const newBookRef = cache.writeFragment({
              data: addBook,
              fragment: gql`
                fragment NewBook on Book {
                  id
                  type
                }
              `
            })
            return [...oldBookRefs, newBookRef]
          }
        }
      })
    }
  })
  
  async function submitHandler () {
    const [err, res] = await to(addBook({variables: { ...args }}))
    if(err) return
    console.log('res..')
  }
  
  return (
      <div className='width-670 margin-auto'>
        <Form inputs={inputs} submitHandler={submitHandler} buttonName='Add Book'/>
      </div>
  )
}

export default AddBook