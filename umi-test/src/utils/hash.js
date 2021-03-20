import SparkMD5 from 'spark-md5'

self.onmessage = (e)=>{
  const {fileChunkList} = e.data
  console.log('fileChunkList', fileChunkList)
  if(!fileChunkList) return
  const spark = new SparkMD5.ArrayBuffer()

  let count = 0, percentage = 0
  function loadNext(index){
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileChunkList[index].file)
    reader.onload = e => {
      count++
      spark.append(e?.target.result)
    }
    if(count===fileChunkList.length){
      self.postMessage({
        msg: 'upload ok',
        percentage: 100,
        hash: spark.end()
      }, 'ts is baga')
      self.close()
    }else{
      percentage+= 100/fileChunkList.length
      self.postMessage({
        percentage
      }, 'ts is baga')
      loadNext(count)
    }
  }
  loadNext(0)
}
