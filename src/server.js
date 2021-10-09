const express = require('express')
const WebSocket = require('ws');
const http = require('http')

const app = express()
app.use(express.json()) 
const server = http.createServer(app)
const ws = new WebSocket.Server({server})

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
  res.status(201).json(posts)
})

ws.on('connection', (client) => {

  console.log('WebSocket connection...')

  client.on('message', (message) => {
    const msg = JSON.parse(message)
    console.log(msg)
  })

  client.send(JSON.stringify( { message: 'welcome', value: "Welcome using WebSocket"}))
})

server.listen(3000, () => {
  console.log("Listening on port 3000")
})