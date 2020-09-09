const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
	console.log("New Websocket Connection")

	socket.on('join', ({ username, room }) => {
		socket.join(room)

		socket.emit('message', generateMessage("Welcome to ChatVille!"))
		socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))
	})

	socket.on('sendMessage', (data, callback) => {
		const filter = new Filter()

		if (filter.isProfane(data)){
			return callback("Profanity is not allowed")
		}

		io.to('Center City').emit('message', generateMessage(data))
		callback()
	})

	socket.on('sendLocation', (data, callback) => {
		io.emit("locationMessage", generateLocationMessage(`https://google.com/maps?q=${data.latitude},${data.longitude}`))
		callback("Location shared!")
	})

	socket.on('disconnect', () => {
		io.emit('message', generateMessage('A user has left!'))
	})
})

server.listen(port, () => {
	console.log(`Server is up on port ${port}`)
})
