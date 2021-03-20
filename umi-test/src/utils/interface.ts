import React from 'react'

interface Body {
  status: number
  statusText: string
  url: string
}

export interface Err {
  response: Body
}
export interface ErrHandler {
  (error: Err): void
}

export interface MouseEv {
  (e: React.MouseEvent<HTMLElement, MouseEvent>): void
}


export type Record = {
  name?: string
  tags?: []
  key?: string
  age?: number
}

type fileResult = {
  shouldUpload: boolean
  uploadList?: []
}

export interface UserState {
  dataSource: Record[]
  fileExistResult: fileResult
}