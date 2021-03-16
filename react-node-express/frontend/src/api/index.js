import axiosInstance from './axios'
import factory       from './factory'
import errHandler    from './error'
import {to}          from '../utils'

export default async ({apiName='', params, retry=10, retryDelay=1000, arrayFormat='indices'}) => {
  const serviceArgs = {params, retry, retryDelay, arrayFormat}
  const {args}      = factory({apiName, serviceArgs})
  
  const [err, res] = await to(axiosInstance(args))
  if (err) {
    errHandler(err)
    return Promise.reject(err)
  }
  const {data: {code, data}} = res
  if (code !== 0) {
    errHandler({code, err: 'server'})
    return Promise.reject(data)
  }
  return Promise.resolve(data)
}
