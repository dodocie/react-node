import http, {argsType} from './factory'
import {to} from '../utils/share'

export const controllerMap = new WeakMap()

export const fetch = async (args: argsType) => {
  // const {controller} = args
  // if(controller){
  //   controllerMap.set(controller.signal, controller)
  // }
  // const [err, res] = await to(http(args))
  // if(controller){
  //   controllerMap.has(controller.signal) && controllerMap.delete(controller.signal)
  // }
  // if(err){
  //   //..handler
  //   return
  // }
  // console.log('res==>', res)
  return http(args)
}
