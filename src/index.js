const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

const port = process.env.PORT || 3000

let count = 0

io.on('connection', (socket) => {
	console.log("New Websocket Connection")

	socket.emit('countUpdated', count)
	socket.on('increment', () => {
		count++
		// socket.emit('countUpdated', count)
		io.emit('countUpdated', count)
	})
})

server.listen(port, () => {
	console.log(`Server is up on port ${port}`)
})
