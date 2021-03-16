export function verify (val, type) {
  const regProps = {
    userName: /^[a-zA-Z_\u4e00-\u9fa5\s]+$/,
    password: /((?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[#@!~%^&*_])|(?=.*\d)(?=.*[#@!~%^&*_]))[a-z\d#@!~%^&*_]{8,16}/i
  }
  if (!val) return {msg: `${type} is required!`, isValid: false, errType: 'required'}
  const isValid = regProps[type].test(val)
  const str     = isValid ? '' : 'not'
  return {msg: `${type} is ${str} qualified!`, isValid, errType: 'unQualified'}
}

export function verifyID (val) {

}

export function sleep (delay) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

export function to (promise) {
  return promise
      .then(data => [null, data])
      .catch(err => [err])
}

export function deepClone(obj){
  if(typeof obj!=='object') return obj
  if(obj instanceof RegExp) return new RegExp(obj)
  if(obj instanceof Date) return new Date(obj)

  let cloneObj = obj.constructor
  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      cloneObj[key] = deepClone(obj[key])
    }
  }
}
