const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
	console.log("New Websocket Connection")

	socket.emit('message', "Welcome to ChatVille")
	socket.broadcast.emit('message', 'A new user has joined!')

	socket.on('sendMessage', (data, callback) => {
		const filter = new Filter()

		if (filter.isProfane(data)){
			return callback("Profanity is not allowed")
		}

		io.emit('message', data)
		callback()
	})

	socket.on('sendLocation', (data, callback) => {
		io.emit("locationMessage", `https://google.com/maps?q=${data.latitude},${data.longitude}`)
		callback("Location shared!")
	})

	socket.on('disconnect', () => {
		io.emit('message', 'A user has left!')
	})
})

server.listen(port, () => {
	console.log(`Server is up on port ${port}`)
})
