import React, {useState, FC, useEffect, useRef, ChangeEvent, MouseEvent} from 'react'
import { Progress } from 'antd';
import {connect, Dispatch} from 'umi'
import {UserState, Record} from '../../utils/interface'
import {to} from '../../utils/share'
import {workerUrl} from '../../utils/hash'

interface Uploader {
  users: UserState
  dispatch: Dispatch
}

type FormData = {
  fileHash: string;
  index: number;
  hash: string;
  size: number;
  chunk: File;
  percentage: number;
}

type FileChunk = {
  file
}

const fragmentSize = 1024*1024*.1

const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading'
}

const Uploader: FC<Uploader> = ({users, dispatch})=>{
  const {fileExistResult} = users

  const [file, setFile] = useState(null)
  const [worker, setWorker] = useState<Worker>()
  const [fileHash, setHash] = useState('')
  const [hashPercentage, setHashPercentage] = useState(0)
  const [status, setStatus] = useState(Status['wait'])
  const [requestList, setFetches] = useState<Promise<{}>[]>([])
  const [formData, setFormData] = useState<FormData[]>([])

  const preview = useRef(null)

  useEffect(() => {
    // console.log('useEffect', formData)
  }, [status, file, worker, hashPercentage, fileHash, formData, requestList])

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
    file.folderName = file.name.split('.')[0]
    setFile(file)
    const URL = window.URL
    const fileUrl = URL.createObjectURL(file)
    const pic: HTMLElement | null = preview.current
    if(pic!==null){
      pic.src = fileUrl
      pic.onload = ()=> URL.revokeObjectURL(fileUrl)//释放文件对象
    }
  }

  const calHash = (fileChunkList: object[]) => {
    return new Promise(resolve=>{
      //web workders.  单独开一个线程，独立于worker。回调不会影响到原来的UI
      const worker = new Worker(workerUrl)
      worker.postMessage({fileChunkList})
      worker.onmessage = (e: MessageEvent) => {
        const {percentage, hash} = e.data
        console.log('percentage----', percentage)
        setHashPercentage(percentage)
        if(hash){
          resolve(hash)
        }
      }
      setWorker(worker)
    })
  }

  const verifyUpload = async (fileHash: string) => {
    const filename = file?.name
    dispatch({type: 'users/verifyUpload', payload: {dataStr: {filename, fileHash}}})
  }

  const uploadChunks = async (formData: FormData[], list: []=[])=>{
    const do_something = ()=>({}) //umi-request 采用 fetch，不支持 xhr的onprogress事件。
    const requestList = formData
      .map(({chunk, hash, index, fileHash})=>{
        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('hash', hash)//切片hash
        formData.append('filename', file?.name)
        formData.append('fileHash', fileHash)
        return {formData, index}
      })
      .map(async({formData})=>dispatch({type: 'users/uploadFile', payload: {formData, onprogress: do_something}}))
      
    setFetches(requestList)
    await Promise.all(requestList)
  }

  const handleUpload = async (event: MouseEvent) => {
    if(!file) return
    setStatus(Status.uploading)
    const fileChunckList: Object[] = createFileChunk(file)
    const [, hash] = await to(calHash(fileChunckList))
    setHash(hash)
    await verifyUpload(hash)//验证，上传
    const {shouldUpload, uploadList} = fileExistResult
    if(!shouldUpload){
      setStatus(Status.wait)
      alert('上传成功')
      return
    }
    const formData = fileChunckList
      .map(({file}, index)=>({
        fileHash: hash,
        index,
        hash: `${hash}-${index}`,
        size: file.size,
        chunk: file,
        percentage: uploadList?.includes(index) ? 100 : 0 //当前切片是否已上传
      }))

    setFormData(formData)
    await uploadChunks(formData, uploadList)
  }

  const resetData = () => {//暂停请求
    // requestList.forEach(()=>dispatch({type: 'user/abort'}))
    if(worker){//停止hash计算
      worker.onmessage = null
    }
  }
  const handlePause = () => {
    setStatus(Status.pause)
    resetData()
  }

  const handleResumit = async () => {
    setStatus(Status.uploading)
    await verifyUpload(fileHash)
    const {shouldUpload, uploadList} = fileExistResult
    await uploadChunks(formData, uploadList)
  }

  return (
    <div>
      <input type="file" name="upload" id="upload" onChange={handleFileChange}/>
      <button onClick={e=>handleUpload(e)}>upload</button>
      <button onClick={handlePause}>pause</button>
      <button onClick={handleResumit}>continue</button>
      <img ref={preview} src="" className='pre-view' id="preview" alt=""/>
      <Progress percent={hashPercentage} />
    </div>
  )
}

// async function upload(event: MouseEvent){
//   const [file] = event.target?.files
//     const file_name = file.name.split('.')[0]

//     const fileChunkList = []
//     let cur = 0
//     while(cur<file.size){
//       fileChunkList.push({ 
//         file: file.slice(cur, cur+fragmentSize)
//       })
//       cur += fragmentSize
//     }

//     const requestList = fileChunkList
//       .map((blob, index)=>{
//         const {file} = blob
//         const formData = new FormData()
//         formData.append('chunk', file)
//         formData.append('filename', `${file_name}-${index}`)
//         return {formData}
//       })
//       .map(async({formData})=>{
//         dispatch({type: 'users/uploadFile', payload: {formData}})
//       })

//     await Promise.all(requestList)

//     const pic: HTMLElement | null = document.getElementById('preview')

//     const URL = window.URL
//     const fileUrl = URL.createObjectURL(file)
//     if(pic){
//       pic.src = fileUrl
//       pic.onload = ()=> URL.revokeObjectURL(fileUrl)//释放文件对象
//     }
// }

const mapState2Props = ({users}: {users: UserState}) => {//users: model.ts namespace:users 
  return {
    users
  }
}


export default connect(mapState2Props)(Uploader)