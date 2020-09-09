const socket = io()

socket.on('message', (data) => {
	console.log(data)
})

let form = document.getElementById("form")

form.addEventListener('submit', e => {
	e.preventDefault()

	let text = form.message.value
	socket.emit("sendMessage", text)
})
