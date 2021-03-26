import { extend } from 'umi-request';
import {errorHandler, options} from './extends/index'
import {ErrHandler} from '../utils/interface'
import {URIS, baseUrl} from './apis'

const Qs = require('qs')
// const controller = new AbortController()
// const { signal } = controller

/**
 * 配置request请求时的默认参数
 */
export type argsType = {
  name: string
  params?: Object
  errHandler?: ErrHandler
  signal?: AbortSignal
}
type param = {
  [k: string]: Object
}

const http = (args: argsType) => {
  const {name, params, errHandler, signal} = args
  const {uri, method, requestType='json', arrayFormat='indices'} = URIS[name]
  const paramType: param = {
    get: {
      params,
      paramsSerializer: function() {
				return Qs.stringify(params, {arrayFormat: arrayFormat})
			}
    },
    post: {
      requestType, 
      data: params
    }
  }

  const headers = {
    'Accept': 'application/json',
  }
  const extendRequest = extend({
    errorHandler: errHandler || errorHandler,
    ...options, headers, signal
  })

  // extendRequest.interceptors.request.use((url, options) => {//allInterceptors.reduce(reducer, Promise.resolve())  reducer: return p1.then =>return p2
  //   return {
  //     url: `${baseUrl}${url}`,
  //     options: {...options, headers, signal},
  //   };
  // }, { global: false });//全局拦截器关闭

  return extendRequest(uri, {method, ...paramType[method]})
};

export default http;