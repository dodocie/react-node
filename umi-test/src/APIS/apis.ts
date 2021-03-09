type requestItem = {
  uri: string
  method: string
  arrayFormat?: string
}

type uriType = {
  [k: string]: requestItem
}

export const URIS: uriType = {
  getNameList: {uri: '/namelist', method: 'get'}
}

export const baseUrl = 'http://localhost:3000'