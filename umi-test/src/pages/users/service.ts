import {fetch} from '../../APIS/request'
import {to} from '../../utils/share'

export async function getRemoteList () {

  const [err, res] = await to(fetch({name: 'getNameList'}))
  console.log('err', err, res)
  
  return res.data.dataSource
}