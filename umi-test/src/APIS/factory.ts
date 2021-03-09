import { extend } from 'umi-request';
import {errorHandler, options} from './extends/index'
import {ErrHandler} from '../utils/interface'
import {URIS, baseUrl} from './apis'

const Qs = require('qs')

/**
 * 配置request请求时的默认参数
 */
type argsType = {
  name: string
  params?: Object,
  errHandler?: ErrHandler
}
type param = {
  [k: string]: Object
}


const http = (args: argsType) => {
  const {name, params, errHandler} = args
  const {uri, method, arrayFormat='indices'} = URIS[name]
  const paramType: param = {
    get: {
      params,
      paramsSerializer: function() {
				return Qs.stringify(params, {arrayFormat: arrayFormat})
			}
    },
    post: {
      data: params
    }
  }
  const extendRequest = extend({
    errorHandler: errHandler || errorHandler,
    ...options
  })

  const headers = {
    'Accept': 'application/json',
  }

  extendRequest.interceptors.request.use((url, options) => {
    return {
      url: `${baseUrl}${url}`,
      options: { ...options, headers},
    };
  });

  return extendRequest(uri, {method, params: {...paramType[method]}})
};

export default http;