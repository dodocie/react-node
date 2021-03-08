import React                      from 'react'
import {useQuery, useReactiveVar} from "@apollo/client"

import {getBooksQuery} from '../../queries/queries'
import Book            from '../../components/Books/Book'
import Loading         from '../../components/Breads/Loading'
import AddBook         from '../../components/Books/AddBook'
import {bookListVar} from '../../ApolloState/cache'

const BookList = () => {//useQuery 不能用在class里面
  const {loading, data} = useQuery(getBooksQuery)
  data && bookListVar(data.books)
  const items = useReactiveVar(bookListVar)
  if(loading){
    return (<Loading/>)
  }
  
  if(!items || items.length === 0) {
    return (
        <p>Could not find any books. maybe Add One?</p>
    )
  }
  console.log('items', items)
  
  return (
      <section id="books">
        <h3 className='margin-top-03 margin-left-03'>Book List</h3>
        <AddBook/>
        <ul className='width-670 margin-auto margin-top-03'>
          {items.map(p=>(
              <Book key={p.id} name={p.name} genre={p.genre} author={p.author.name}/>
          ))}
        </ul>
      </section>
  )
}
export default BookList