const { resolve } = require('path')
const path = require('path')
const fse = require('fs-extra') //改良版的fs模块
const UPLOAD_DIR = path.resolve(__dirname, '.', 'target')

const resolvePost = req => {
  new Promise(resolve=>{
    let chunk = ''
    req.on('data', data => {
      chunk += data //二进制流数据
    })
    req.on('end', ()=>{
      resolve(JSON.parse(chunk))
    })
  })
}

const extractExt = filename => filename.slice(filename.lastIndexOf('.'), filename.length)

module.exports = class {
  async hanleVerifyUpload(req, res){
    const {fileHash, filename} = await resolvePost(req)
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
}