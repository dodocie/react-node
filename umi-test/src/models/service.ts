import {fetch} from '../APIS/request'
import {to} from '../utils/share'

export async function getRemoteList () {

  const [err, res] = await to(fetch({name: 'getNameList'}))
  console.log('err', err, res)
  
  return res.data.dataSource
}

export async function upload(params: any) {
  const [err, res] = await to(fetch({name: 'uploadFile', params}))
  //...errHandler
}

export async function verifyFile(dataStr: string) {
  const [err, res] = await to(fetch({name: 'verifyFile', dataStr}))
  //...errHandler
  return res.data.result
}