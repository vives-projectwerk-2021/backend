const express = require('express')
const http = require('http')
const WS = require('./modules/websocket.js')

const app = express()
app.use(express.json()) 
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

server.listen(3000, () => {
  console.log("Listening on port 3000")
})