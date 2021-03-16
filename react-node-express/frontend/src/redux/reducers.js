import {combineReducers} from 'redux'

const initUser = {
  userName: '',
  message : '',
  code    : '',
}

function user (state = initUser, action) {
  const actionTypes = {
    auth_success: () => ({...state, ...action.user, redirectTo: '/home'}),
    err_msg     : () => ({...state, message: action.message}),
    receive_user: () => action.user,
    reset_user  : () => ({...initUser, message: action.message})
  }
  const def = () => state
  
  return (actionTypes[action.type] || def)()
}

export default combineReducers({
  user
})
