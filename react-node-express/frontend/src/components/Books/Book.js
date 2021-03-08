import React, {Component}       from 'react'

const Book = props =>{
  const {name, genre, author} = this.props
  return (
    <li className='margin-bottom-02'>
      <h5>{name}</h5>
      <div className='flex-center-between font-30'>
        <p>Genre: {genre}</p>
        <p>author: {author}</p>
      </div>
    </li>
)
}

export default Book