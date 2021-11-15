import config from "./config/config.js";
import express from "express";
import cors from "cors";
import http from "http";
import values_db from "./databases/values_db.js"
import WSS from "./modules/websocket.js";
import DeviceRoute from "./routes/deviceRoute.js";
import UserRoute from "./routes/userRoute.js";
import { validate } from "jsonschema";
import { DeviceDataChecker } from "./validation/DeviceDataChecker.js";

const app = express()
app.use(express.json())
app.use(cors())
const server = http.createServer(app)

let resentLiveData = {}
const wss = new WSS(server, resentLiveData)


app.get('/', (req, res) => {
  res.send(`<h1>Connected to Pulu Backend</h1>
            <p> Go to /live-data to see most recent device data</p>`)
})

app.get('/live-data', (req, res) => {
  res.status(201).send(resentLiveData)
})


//Data coming from our devices in the field is send here to the frontend
app.post('/live-data', (req, res) => {
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
  resentLiveData = data
  wss.webSocketSend(data)
  res.status(201).json(resentLiveData)
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

//ACCOUNTS
app.get('/users', UserRoute.list);
app.get('/users/amount', UserRoute.get_amount);
app.post('/users/login', UserRoute.login);
app.post('/users', UserRoute.post);
app.delete('/users', UserRoute.delete);



// Devices
app.get('/devices', DeviceRoute.list);
app.get('/devices/:id', DeviceRoute.get);
app.post('/devices', DeviceRoute.post);
app.delete('/devices', DeviceRoute.delete); // TODO change to REST
app.put('/devices', DeviceRoute.put); // TODO change to REST



server.listen(config.server.port, () => {
  console.log(`Listening on port ${config.server.port}`)
})