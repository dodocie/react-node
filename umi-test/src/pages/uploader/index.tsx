import React, {useState, FC, useEffect, useRef, ChangeEvent, MouseEvent} from 'react'
import { Progress } from 'antd';
import {connect, ControllerState, Dispatch} from 'umi'
import {UploaderState} from '../../models/uploader/model'
import {to} from '../../utils/share'
import {workerUrl} from '../../utils/hash'
import Abort from '../../components/abort'

interface Uploader {
  uploader: UploaderState
  controller: ControllerState
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
  file: Blob
}

const fragmentSize = 1024*1024

const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading'
}

const Uploader: FC<Uploader> = ({uploader, controller, dispatch})=>{
  const {fileExistResult} = uploader
  const {controllers} = controller

  const [file, setFile] = useState(null)
  const [worker, setWorker] = useState<Worker>()
  const [fileHash, setHash] = useState('')
  const [hashPercentage, setHashPercentage] = useState(0)
  const [status, setStatus] = useState(Status['wait'])
  const [fetchType, setFetchType] = useState('')
  const [signalList, setFetches] = useState<AbortSignal[]>([])
  const [formData, setFormData] = useState<FormData[]>([])

  const preview = useRef(null)

  useEffect(() => {
    // console.log('useEffect', formData)
  }, [status, file, worker, hashPercentage, fileHash, formData, signalList, fetchType])

  const createFileChunk = (file: Blob, size=fragmentSize): Array<FileChunk>=>{
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
      pic.onload = ()=> URL.revokeObjectURL(fileUrl)//??????????????????
    }
  }

  const calHash = (fileChunkList: object[]) => {
    return new Promise(resolve=>{
      //web workders.  ?????????????????????????????????worker?????????????????????????????????UI
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
    dispatch({type: 'uploader/verifyUpload', payload: {dataStr: {filename, fileHash}}})
  }

  const uploadChunks = async (formData: FormData[], list: []=[])=>{
    const do_something = ()=>({}) //umi-request ?????? fetch???????????? xhr???onprogress?????????
    const requestName = 'upload'

    const requestList = formData
      .map(({chunk, hash, index, fileHash})=>{
        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('hash', hash)//??????hash
        formData.append('filename', file?.name)
        formData.append('fileHash', fileHash)
        const controller = new AbortController()
        return {formData, index, controller}
      })

    setFetchType(requestName) 

    requestList.forEach(({formData, controller})=>{
      dispatch({type: 'uploader/uploadFile', payload: {formData, controller, fetchType: requestName, onprogress: do_something}})
    })
    const signalList: AbortSignal[] = requestList.map(item=>item.controller.signal)
    setFetches(signalList)
  }

  const handleUpload = async (event: MouseEvent) => {
    if(file === null) return
    setStatus(Status.uploading)
    const fileChunckList: FileChunk[] = createFileChunk(file)
    const [, hash] = await to(calHash(fileChunckList))
    setHash(hash)
    await verifyUpload(hash)//???????????????
    const {shouldUpload, uploadList} = fileExistResult
    if(!shouldUpload){
      setStatus(Status.wait)
      alert('????????????')
      return
    }
    const formData = fileChunckList
      .map(({file}, index)=>({
        fileHash: hash,
        index,
        hash: `${hash}-${index}`,
        size: file.size,
        chunk: file,
        percentage: uploadList?.includes(index) ? 100 : 0 //???????????????????????????
      }))

    setFormData(formData)
    await uploadChunks(formData, uploadList)
  }

  const handlePause = () => {
    console.log('pause...')
    setStatus(Status.pause)
    if(worker){//??????hash??????
      worker.onmessage = null
    }
  }

  const handleResumit = async () => {
    setStatus(Status.uploading)
    await verifyUpload(fileHash)
    const {shouldUpload, uploadList} = fileExistResult
    await uploadChunks(formData, uploadList)
  }

  const styles = ['aaa-1']

  return (
    <div>
      <div className="flex flex-around">
        <input type="file" name="upload" id="upload" className="file-input" onChange={handleFileChange}/>
        <button onClick={e=>handleUpload(e)}>upload</button>
        <Abort styles={styles} signalList={signalList} fetchType={fetchType} handler={handlePause}/>
        <button onClick={handleResumit}>continue</button>
      </div>
      <img ref={preview} src="" className='pre-view' id="preview" alt=""/>
      <Progress percent={hashPercentage} />
    </div>
  )
}

const mapState2Props = ({uploader, controller}: {uploader: UploaderState, controller: ControllerState}) => {
  return {
    uploader,
    controller
  }
}


export default connect(mapState2Props)(Uploader)