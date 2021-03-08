const isDev                     = process.env.DEV || process.env.NODE_ENV!=='production'
const { MongoClient, ObjectId } = require('mongodb')

const defConfig = require('./config.json')[isDev ? 'mongodb-dev' : 'mongodb']

const clients = {}

async function connect(config) {
  const { connectionURI, options : { auth : { user = null, password = null } = {} } = {} } = config
  if(!isDev && (!user || !password)) Promise.reject('username or password required')
  
  try{
    const client = await MongoClient.connect(connectionURI, (err, db)=>{
    
    })
    return Promise.resolve(client)
  }catch (e) {
    return Promise.reject({message: 'failed..', error: e})
  }
  
}

exports.ObjectId = ObjectId
exports.db = async (dbName, config=defConfig) => {
  if (!dbName) throw new Error('db name is missing.')
  if (clients[dbName]==null) clients[dbName] = await connect(config)
  return clients[dbName].db(dbName)
}

exports.close = async (dbName = null) => {
  if (dbName==null || clients[dbName]==null) return ''
  
  if (clients[dbName].isConnected(dbName)) {
    await clients[dbName].close()
  }
  
  return ''
}