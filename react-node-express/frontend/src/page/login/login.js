import React, {Component} from 'react'
import {connect}          from 'react-redux'
import {login}            from '../../redux/actions'
import User               from '../../containers/User/User'

class Login extends Component {
  constructor (props) {
    super(props)
    this.onLogin        = this.onLogin.bind(this)
    this.toRegisterPage = this.toRegisterPage.bind(this)
    this.state          = {
      inputs: ['userName', 'password', 'code'],
    }
  }
  
  onLogin (state) {
    this.props.login(state)
  }
  
  toRegisterPage = () =>{
    this.props.history.push('/register')
  }
  render () {
    return (<div>
      <header className='flex-end-between'>
        <h2>Login</h2>
        <p onClick={this.toRegisterPage}>to Register -></p>`
      </header>
      <User state={this.state} submitHandler={this.onLogin} user={this.props.user}/>
    </div>)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: user => dispatch(login(user))
  }
}

export default connect(
    state => ({user: state.user}),
    mapDispatchToProps
)(Login)