import React, {useState, FC, useEffect, useRef, ChangeEvent, MouseEvent} from 'react'
import { Progress } from 'antd';
import {connect, Dispatch} from 'umi'
import {UserState, Record} from '../../utils/interface'
import IWorker from '../../utils/hash'

// import('../../utils/hash').then(res=>{
//   console.log(res)
//   const worker = new Worker(res)
//   console.log(worker)
// })

interface Uploader {
  users: UserState
  dispatch: Dispatch
}

const fragmentSize = 1024*1024*.5

const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading'
}

const Uploader: FC<Uploader> = ({users, dispatch})=>{
  const {fileExistResult} = users

  const [file, setFile] = useState(null)
  const [worker, setWorker] = useState<Worker>()
  const [hash, setHash] = useState('')
  const [hashPercentage, setHashPercentage] = useState(0)
  const [status, setStatus] = useState(Status['wait'])

  const preview = useRef(null)

  useEffect(() => {
  }, [status, file, worker, hash])

  const createFileChunk = (file: Blob, size=fragmentSize): Array<Object>=>{
    const fileChunkList = []
    let cur = 0
    while(cur<file.size){
      fileChunkList.push({ 
        file: file.slice(cur, cur+fragmentSize)
      })
      cur += fragmentSize
    }
    return fileChunkList
  }

  const handleFileChange = (event: ChangeEvent) => {
    const [file] = event.target?.files
    const file_name = file.name.split('.')[0]
    setFile(file)
    const URL = window.URL
    const fileUrl = URL.createObjectURL(file)
    const pic: HTMLElement | null = preview.current
    if(pic!==null){
      pic.src = fileUrl
      pic.onload = ()=> URL.revokeObjectURL(fileUrl)//释放文件对象
    }
  }

  const calHash = async (fileChunkList: object[]) => {
    return new Promise(resolve=>{
      //web workders.  单独开一个线程，独立于worker。回调不会影响到原来的UI
      const worker = new IWorker()
      worker.postMessage({fileChunkList})
      worker.onmessage = (e: MessageEvent) => {
        const {percentage, hash} = e.data
        setHashPercentage(percentage)
        console.log('hash', hash)
        if(hash){
          setHash(hash)
          resolve(hash)
        }
      }
      setWorker(worker)
    })
  }

  const verifyUpload = async () => {
    const filename = file?.name
    dispatch({type: 'users/verifyUpload', payload: {dataStr: JSON.stringify({filename, fileHash: hash})}})
  }

  const handleUpload = async (event: MouseEvent) => {
    if(!file) return
    setStatus(Status.uploading)
    const fileChunckList = createFileChunk(file)
    await calHash(fileChunckList)
    await verifyUpload()//验证，上传
    const {shouldUpload, uploadList} = fileExistResult
  }

  return (
    <div>
      <input type="file" name="upload" id="upload" onChange={handleFileChange}/>
      <img ref={preview} src="" className='pre-view' id="preview" alt=""/>
      <button onClick={e=>handleUpload(e)}>upload</button>
      <Progress percent={hashPercentage} />
    </div>
  )
}

async function upload(event: MouseEvent){
  const [file] = event.target?.files
    const file_name = file.name.split('.')[0]

    const fileChunkList = []
    let cur = 0
    while(cur<file.size){
      fileChunkList.push({ 
        file: file.slice(cur, cur+fragmentSize)
      })
      cur += fragmentSize
    }

    const requestList = fileChunkList
      .map((blob, index)=>{
        const {file} = blob
        const formData = new FormData()
        formData.append('chunk', file)
        formData.append('filename', `${file_name}-${index}`)
        return {formData}
      })
      .map(async({formData})=>{
        dispatch({type: 'users/uploadFile', payload: {formData}})
      })

    await Promise.all(requestList)

    const pic: HTMLElement | null = document.getElementById('preview')

    const URL = window.URL
    const fileUrl = URL.createObjectURL(file)
    if(pic){
      pic.src = fileUrl
      pic.onload = ()=> URL.revokeObjectURL(fileUrl)//释放文件对象
    }
}

const mapState2Props = ({users}: {users: UserState}) => {//users: model.ts namespace:users 
  return {
    users
  }
}


export default connect(mapState2Props)(Uploader)