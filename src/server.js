const express = require('express')

const app = express()
app.use(express.json()) 

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


app.listen(3000)
