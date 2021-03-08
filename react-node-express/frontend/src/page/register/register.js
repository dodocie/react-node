import React, {Component} from 'react'
import {connect}          from 'react-redux'
import {register}         from '../../redux/actions'
import User               from '../../containers/User/User'

/*
* fun.bind(thisArg[, arg1[, arg2[, ...]]])
* thisArg 当绑定函数被调用时，该参数会作为原函数运行时的 this 指向。当使用new 操作符调用绑定函数时，该参数无效。
* arg1, arg2, ... 当绑定函数被调用时，这些参数将置于实参之前传递给被绑定的方法。
*/
class Register extends Component {
  constructor (props) {
    super(props);
    this.onRegister  = this.onRegister.bind(this)
    this.toLoginPage = this.toLoginPage.bind(this)
    this.state       = {
      login : '',
      inputs: ['userName', 'password', 'password2', 'code'],
    }
  }

  toLoginPage = () =>{
    this.props.history.push('/login')
  }
  
  render () {
    return (
        <div>·
          <header className='flex-end-between'>
            <h2>Register</h2>
            <p onClick={this.toLoginPage}>to Login -></p>
          </header>
          <User state={this.state} submitHandler={this.onRegister} user={this.props.user}/>
        </div>
    )
  }
  
  onRegister (state) {
    this.props.register(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    register: user => dispatch(register(user))
  }
}

export default connect(
    state => ({user: state.user}),
    mapDispatchToProps
)(Register)