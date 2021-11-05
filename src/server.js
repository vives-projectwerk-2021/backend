import config from "./config/config.js";
import express from "express";
import cors from "cors";
import http from "http";
import values_db from "./databases/values_db.js"
import users_db from "./databases/users_db.js"
import WSS from "./modules/websocket.js";
import { validate } from "jsonschema";
import { AddSensorChecker } from "./validation/AddSensorChecker.js"
import { DeviceDataChecker } from "./validation/DeviceDataChecker.js";

const app = express()
app.use(express.json())
app.use(cors())
const server = http.createServer(app)
const wss = new WSS(server)

const posts = []

app.get('/', function (req, res) {
  res.send('Hello World!')
  console.log("connected")
})

app.get('/posts', (req, res) => {
  res.status(201).send(posts)
})


//Data coming from our devices in the field is send here to the frondend
app.post('/posts', (req, res) => {
  const data = req.body
  const validation = validate(data, DeviceDataChecker.create)
  if (!validation.valid) {
    console.log("The json validator where data from the devices is send to the front end gave an error: ",validation.errors)
    res.status(400).send({
      message: 'JSON validation failed',
      details: validation.errors.map(e => e.stack)
    })
    return;
  }
  posts.push(data)
  wss.webSocketSend(data)
  res.status(201).json(posts)
})

// INFLUX
// Connecting to the Influx client
let api2 = new values_db();

app.post('/data', (req, res) => {
  api2.writeData().then(result => res.status(201).send(result));
})

app.get('/sensors', (req, res) => {
  api2.readData().then(result => res.status(200).send(result));
})


//MONGO
let api = new users_db();


//ACCOUNTS
app.get('/users', (req, res) => {
  api.findAllUsers().then(result => res.status(201).send(result))

})

app.get('/users/amount', (req, res) => {
  api.findAllUsers().then(result => res.status(201).send([{ amount: result.length }]))

})

app.post('/users/login', function (req, res) {
  const data = req.body
  api.findUserByName(data.username, data.password).then(result => res.status(201).json(result))
})

app.post('/users', function (req, res) {
  const data = req.body

  api.createUser(data.username, data.password).then(result => {
    if (result == "Already exists") {
      res.status(201).json([{ message: result }])
    } else {
      res.status(201).json([{ message: "Success" }])
    }
  })
})

app.delete('/users', function (req, res) {
  const data = req.body
  api.deleteUser(data.username, data.password).then(result => res.status(201).json(result))
})



//DEVICES

app.get('/devices', (req, res) => {
  api.showAllDevices().then(result => res.status(201).send(result))

})

app.get('/devices/:id', (req, res)=>{
  const id= req.params.id
  api.getDeviceByID(id).then(result => res.status(201).send(result))
})

//Here comes the data from the frond end to make a new device
app.post('/devices', function (req, res) {

  const data = req.body
  console.log(data)
  const validation = validate(data, AddSensorChecker.create)
  if (!validation.valid) {
    res.status(400).send({
      message: 'JSON validation failed',
      details: validation.errors.map(e => e.stack)
    })
    return;
  }
  api.createDevice(data.deviceid, data.devicename, data.location, data.firstname, data.lastname).then(result => res.status(201).json(result)).catch(() => {
    res.status(500).send({
      message: "Failed to write to JSON db",
      code: 105
    })
  })
})

app.delete('/devices', function(req,res){
  const data = req.body
  api.deleteDevice(data.deviceid).then(result => res.status(201).json(result))


})

app.put('/devices',function(req,res){
  const data = req.body

  api.putDevice(data.deviceid, data.devicename, data.location, data.firstname, data.lastname).then(result => res.status(201).json(result))
})



server.listen(config.server.port, () => {
  console.log(`Listening on port ${config.server.port}`)
})