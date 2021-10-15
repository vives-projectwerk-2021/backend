const express = require('express')
const cors = require('cors')
const http = require('http')
const WS = require('./modules/websocket.js')

const app = express()
app.use(express.json()) 
app.use(cors())
const server = http.createServer(app)
const ws = new WS(server)

const posts = []

app.get('/', function (req, res) {
  res.send('Hello World!')
  console.log("connected")
})

app.get('/posts', (req, res) => {
  res.status(201).send(posts)
})

app.post('/posts', (req, res) => {
  const data = req.body
  posts.push(data)
  ws.webSocketSend(data)
  res.status(201).json(posts)
})

// INFLUX
  // Connecting to the Influx client
const influxAPI = require('./api/influxAPI')
api2 = new influxAPI();

app.get('/influx/sensors', (req, res) => {
  api2.writeData().then( result => res.status(201).send(result))
})


//MONGO
const MongoAPI =require('./api/mongoAPI')
api= new MongoAPI();


  //ACCOUNTS
app.get('/mongo/allusers', (req, res) => {
  api.findAllUsers().then( result => res.status(201).send(result))
  
})

app.get('/mongo/usersnumber', (req, res) => {
  api.findAllUsers().then( result => res.status(201).send([{amount:result.length}]))
  
})
  
app.post('/mongo/login',function (req, res) {
  const data = req.body
  api.findUserByName(data.username,data.password).then( result =>  res.status(201).json(result))
})

app.post('/mongo/signup',function(req, res) {
  const data = req.body

  api.createUser(data.username,data.password).then(result=>{
    if(result=="Already exists"){
      res.status(201).json([{message:result}])
    }else{
      res.status(201).json([{message:"Success"}])
    }
  })
})

app.post('/mongo/deleteuser',function (req, res) {
  const data = req.body
  api.deleteUser(data.username,data.password).then( result =>  res.status(201).json(result))
})



//DEVICES

app.get('/mongo/alldevices', (req, res) => {
  api.showAllDevices().then( result => res.status(201).send(result))
  
})

app.post('/mongo/createdevice',function(req, res){
  const data= req.body
  console.log(data)
  api.createDevice(data.name,data.location).then(result=> res.status(201).json(result))
})



server.listen(3000, () => {
  console.log("Listening on port 3000")
})