import React, {Component} from 'react'
import { Link }           from 'react-router-dom'
import {connect}          from 'react-redux'

class Home extends Component{
  render(){
    const {user} = this.props
    return (<div>
      <header className='flex-end-between width-750 padding-442'>
        <h2>Home</h2>
        {user._id && <p className='font-main font-333333'>{user.userName}</p>}
      </header>
      <p className='font-subtitle-normal margin-left-03'>这是个试验田。</p>
      
      <div className='width-670 margin-auto margin-top-03'>
        <h5>以下组件尝试redux + axios</h5>
        <ul className='font-30 font-333333'>
          <li className='list-style-dot'><Link to="/login">Login</Link></li>
          <li className='list-style-dot'><Link to="/register">Register</Link></li>
        </ul>
      </div>
      
      <div className='width-670 margin-auto margin-top-03'>
        <h5>以下组件尝试GraphQL + Apollo</h5>
        <ul className='font-30 font-333333'>
          <li className='list-style-dot'><Link to="/books">Book List</Link></li>
        </ul>
      </div>
    </div>)
  }
}

export default connect(
    state => ({user: state.user}),
)(Home)