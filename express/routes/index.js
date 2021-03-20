const express = require('express');
const {v4: uuidv4} = require('uuid')
const md5          = require('blueimp-md5')
const multiparty = require('multiparty') // form表单上传第三方库
const path = require('path')
const UPLOAD_DIR = path.resolve(__dirname, '../uploader', 'target')
const fse = require('fs-extra') //改良版的fs模块
const mergeFileChunk = require('../uploader/merge').mergeFileChunk
const Controller = require('../uploader/controller')
const controller = new Controller()

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
const router = express.Router();

router.get('/namelist', function(req, res, next) {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      tags: ['歌手']
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
      tags: ['演员']
    }
  ]
  // res.cookie('userid', user._id, {maxAge: 864000000})
  res.send({code: 0, data: {dataSource}})
});

router.post('/upload', (req, res, next)=>{
  const multipart = new multiparty.Form()
  multipart.parse(req, async (err, fields, files)=>{
    if(err) return

    const [chunk] = files.chunk
    const [filename] = fields.filename
    const dir_name = filename.split('-')[0]
    const chunkDir = path.resolve(UPLOAD_DIR, dir_name)
    const filePath = path.resolve(UPLOAD_DIR, '..', `${dir_name}.jpeg`)
    if(!fse.existsSync(chunkDir)){
      await fse.mkdirs(chunkDir)
    }
    await fse.move(chunk.path, `${chunkDir}/${filename}`)
  })
  res.send({code: 0, data: {done: 1}})
})

router.post('/verifyFile', async (req, res, next)=>{
  await controller.hanleVerifyUpload(req, res)
})

module.exports = router;
