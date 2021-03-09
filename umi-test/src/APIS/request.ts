import http from './factory'
import {ErrHandler} from '../utils/interface'

type args = {
  name: string
  params?: Object
  errHandler?: ErrHandler
}

export function fetch(args: args){
  return http(args)
}
