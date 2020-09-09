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

let locationBtn = document.getElementById("send-location")

locationBtn.addEventListener("click", () => {
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser.')
	}
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit("sendLocation", {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		})
	})
})
