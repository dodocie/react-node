const path = require('path')
const fse = require('fs-extra') //改良版的fs模块
const { WriteStream } = require('fs')
const { resolve } = require('path')

//合并文件块
const UPLOAD_DIR = path.resolve(__dirname, '.', 'target')

const pipeStream = (path, writeStream) => new Promise(resolve=>{
  const readStream = fse.createReadStream(path) //创建可读流
  readStream.on('end', ()=>{
    fse.unlinkSync(path )
    resolve()
  })
  readStream.pipe(writeStream) //写入可写流
})

const mergeFileChunk = async (filePath, fileName, size) => {//filePath 为要写入的文件路径 xxx.jpeg
  const chunkDir = path.resolve(UPLOAD_DIR, fileName)
  console.log('filepath', filePath, fileName, chunkDir)

  const chunkPaths = await fse.readdir(chunkDir)
  chunkPaths.sort((a, b)=>a.split('-')[1]-b.split('-')[1]) //和前端约定的文件名顺序定义
  await Promise.all(chunkPaths.map((chunkpath, index)=>{
    pipeStream(
      path.resolve(chunkDir, chunkpath),
      fse.createWriteStream(filePath, {
        start: index * size,
        end: (index+1) * size
      })
    )
  }))
  console.log('文件合并成功 ')
  fse.rmdirSync(chunkpath)//合并成功后，删除二进制流文件
}

exports.mergeFileChunk = mergeFileChunk