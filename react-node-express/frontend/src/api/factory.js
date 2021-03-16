import APIs from './Apis'

const Qs = require('qs')

export default ({apiName, serviceArgs = {}}) => {
  const {method, url} = APIs[apiName] || serviceArgs
  const {params, retry, retryDelay, arrayFormat} = serviceArgs
  
  const args = {
    method,
    url,
    retry,
    retryDelay
  }
  
  const methodProps = {
    get: {
      params,
      paramsSerializer: function() {
        return Qs.stringify(params, {arrayFormat})
      }
    },
    post: {
      data: params
    }
  }
  
  return {url, args: {...args, ...methodProps[method]}}
}