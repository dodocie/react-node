const { resolve } = require('path')
const path = require('path')
const fse = require('fs-extra') //改良版的fs模块
const multiparty = require('multiparty') // form表单上传第三方库
const {mergeFileChunk} = require('./merge.js')

const UPLOAD_DIR = path.resolve(__dirname, '.', 'target')

const extractExt = filename => filename.slice(filename.lastIndexOf('.'), filename.length)

module.exports = class {
  async hanleVerifyUpload(req, res){
    const {fileHash, filename} = req.body
    const ext = extractExt(filename)
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`)
    console.log(filePath)
    if(fse.existsSync(filePath)){
      // res.end(JSON.stringify({shouldUpload: false}))
      res.send({code: 0, data: {shouldUpload: false}})
    }else{
      const result = {shouldUpload: true, uploadedList: []}
      res.send({code: 0, data: {result}})
    }
  }

  async handleFormData(req, res){
    const multipart = new multiparty.Form()
    multipart.parse(req, async (err, fields, files)=>{
      if(err) {
        console.error(err)
        res.send({code: -1, message: 'process file chunk failed'})
        return
      }

      const [chunk] = files.chunk
      const [filename] = fields.filename
      const [fileHash] = fields.fileHash
      const [hash] = fields.hash
      const chunkDir = path.resolve(UPLOAD_DIR, fileHash)
      const filePath = path.resolve(chunkDir, `${hash}`)

      if(fse.existsSync(filePath)){
        res.send({code: 1, message: 'file exit'})
        return
      }
      if(!fse.existsSync(chunkDir)){
        await fse.mkdirs(chunkDir)
      }
      await fse.move(chunk.path, path.resolve(chunkDir, hash))
      res.send({code: 0, data: {done: 1}})
    })
  }

  async handleMerge(req, res){
    const {fileHash, filename, size} = req.body
    const ext = extractExt(filename) //.jpeg
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`)
    await mergeFileChunk(filePath, fileHash, size)
    res.send({code: 0, data: {done: 2}})
  }
}