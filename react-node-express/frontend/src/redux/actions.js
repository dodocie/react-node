import request      from '../api'
import {to, verify} from '../utils'

import {
  AUTH_SUCCESS,
  ERR_MSG,
  RECEIVE_USER,
  RESET_USER
} from './action-type'

const authSuccess = user => ({type: AUTH_SUCCESS, user})
const errMsg      = err => ({type: ERR_MSG, message: err.message})
const receiveUser = user => ({type: RECEIVE_USER, user})
const resetUser   = message => ({type: RESET_USER, message})

const verifyHandler = args => {
  const {required, unQualified} = args
      .reduce((obj, {val, type}) => {
        const {errType, isValid} = verify(val, type)
        if (!isValid) obj[errType].push(type)
        return obj
      }, {required: [], unQualified: []})
  
  const isValid      = !required.length && !unQualified.length
  const requiredCopy = required.length ? `${required.join(', ')} required! ` : ''
  const validateCopy = unQualified.length ? `${unQualified.join(',')} unQualified! ` : ''
  return {
    isValid,
    message: `${requiredCopy} ${validateCopy} `
  }
}

export const register = user => {
  return async dispatch => {
    const {userName, password, password2, code} = user
    
    if (password !== password2) {
      dispatch(errMsg({message: 'not same password!'}))
      return
    }
    console.log('user', user)
    const registerArr = ['userName', 'password', 'code'].map(type => ({type, val: user[type]}))
    const {isValid, message}    = verifyHandler(registerArr)
    if (!isValid) {
      dispatch(errMsg({message}))
      return
    }
    
    const [err, result] = await to(request({apiName: 'register', params: {userName, password, verificationCode: code}}))
    if (err) {
      dispatch(errMsg(err))
      return
    }
    dispatch(authSuccess(result))
  }
}

export const login = user => {
  return async dispatch => {
    //verifyHandler([]) same as function 'register' above
    
    const [err, result] = await to(request({apiName: 'login', params: user}))
    if (err) {
      dispatch(errMsg(err))
      return
    }
    dispatch(authSuccess(result))
  }
}

export const update = user => {
  return async dispatch => {
    const [err, result] = await to(request({apiName: 'update', params: user}))
    if (err) {
      dispatch(resetUser(err.msg))
      return
    }
    dispatch(receiveUser(result))
  }
}