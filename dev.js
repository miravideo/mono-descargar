const express = require('express')
const app = express()
const port = 3000

app.get('/*.html', (req, res) => {
  res.sendFile(__dirname + req.path);
})

app.get('/*.user.js', (req, res) => {
  res.sendFile(__dirname + '/dist' + req.path);
})

app.get('/mono.*.min.js', (req, res) => {
  res.sendFile(__dirname + '/dist/mono.min.js');
})

app.get('/mono.*.js', (req, res) => {
  res.sendFile(__dirname + '/dist/mono.js');
})

app.get('/*', (req, res) => {
  res.send(`Hola! ${req.headers['user-agent']} ${req.originalUrl} ${req.url}`)
})

app.listen(port, () => {
  console.log(`dev app listening on port ${port}`)
})