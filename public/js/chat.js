const socket = io()

socket.on('countUpdated', (data) => {
	console.log("The count has been updated", data)
})

let button = document.getElementById("increment")

button.addEventListener('click', () => {
	console.log("clicked")

	socket.emit('increment')
})
