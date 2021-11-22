// IMPORTS
import config from "./config/config.js";
import express from "express";
import cors from "cors";
import http from "http";
import values_db from "./databases/values_db.js"
import WSS from "./modules/websocket.js";
import DeviceRoute from "./routes/deviceRoute.js";
import UserRoute from "./routes/userRoute.js";
import { validate } from "jsonschema";
import { DataChecker } from "./validation/DataChecker.js";

const app = express()
app.use(express.json())
app.use(cors())
const server = http.createServer(app)

let recentLiveData = {}
const wss = new WSS(server, recentLiveData)

app.get('/', (req, res) => {
  res.send(`<h1>Connected to Pulu Backend</h1>
            <p> Go to /live-data to see most recent device data</p>`)
})

// Influx
// Connecting to the Influx client
let api2 = new values_db();


app.get('/sensors', (req, res) => {
  res.status(201).send(recentLiveData)
  // api2.readData().then(result => res.status(200).send(result));
})


app.post('/sensors', (req, res) => {
  // Receiving the data from the device
  const data = req.body

  // JSON validation of the received data to check before writing
  const validation = validate(data, DataChecker.create)
  if (!validation.valid) {
    console.log("The JSON validator gave an error: ", validation.errors)
    res.status(400).send({
      message: 'JSON validation failed',
      details: validation.errors.map(e => e.stack)
    })
    return;
  }

  // Writing the data to the database
  api2.writeData(data)
  .then(res.status(201))
  .catch(e => console.error(e))

  // Making sure new connections always have some data
  recentLiveData = data
  wss.webSocketSend(data)
  res.status(201).json(recentLiveData)
})


// Mongo
// Accounts
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

// Server
server.listen(config.server.port, () => {
  console.log(`Listening on port ${config.server.port}`)
})