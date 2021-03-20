type requestItem = {
  uri: string
  method: string
  requestType?: string
  arrayFormat?: string
}

type uriType = {
  [k: string]: requestItem
}

export const URIS: uriType = {
  getNameList: {uri: '/namelist', method: 'get'},
  uploadFile: {uri: '/upload', method: 'post', requestType: 'form'},
  verifyFile: {uri: '/verifyFile', method: 'post'}
}

export const baseUrl = 'http://localhost:3000'