const express = require('express');
const {v4: uuidv4} = require('uuid')
const md5          = require('blueimp-md5')

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

module.exports = router;
