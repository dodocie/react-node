import React, {Component} from 'react'
import {Redirect}         from 'react-router-dom'
import Form               from '../../components/Form/form'

const inputTypes = {
  userName: {
    type         : 'text',
    id           : 'user-name',
    name         : 'full-name',
    placeholder  : 'please enter your full name'
  },
  password: {
    type         : 'text',
    id           : 'user-password',
    name         : 'password',
    placeholder  : 'please enter your password',
  },
  password2: {
    type         : 'text',
    id           : 'user-password-confirm',
    name         : 'password-confirm',
    placeholder  : 'please confirm your password',
  },
  code: {
    type         : 'text',
    id           : 'user-verify-code',
    name         : 'verify-code',
    placeholder  : 'please enter verify code',
    config: {
      width: 'width-450',
      imgSrc: 'http://localhost:5000/captcha'
    },
  }
}

class User extends Component {
  constructor (props) {
    super(props)
    this.submitHandler = () => props.submitHandler(this.state)
    this.state = {
      inputs   : props.state.inputs.map(type=>({changeHandler: val => this.handleChange(val, type), ...inputTypes[type]})),
      userName : '',
      password : '',
      password2: '',
      code     : '',
    }
  }
  
  handleChange = (e, type) => {
    const val         = e.target.value
    this.setState({[type]: val})
  }
  
  render () {
    const {message, redirectTo} = this.props.user
    console.log('user', this.props.user)
  
    if(redirectTo){
      return <Redirect to={redirectTo}/>
    }
    return (<div className='width-670 margin-auto margin-top-03'>
      {message && <p className='font-26 font-orange'>{message}</p>}
      <Form inputs={this.state.inputs} submitHandler={this.submitHandler} buttonName='register'/>
    </div>)
  }
}

export default User