const socket = io()

let form = document.getElementById("form")
let formInput = form.querySelector("input")
let formBtn = form.querySelector("button")
let locationBtn = document.getElementById("send-location")
const messages = document.getElementById("messages")

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML
const locationMessageTemplate = document.getElementById("location-message-template").innerHTML

socket.on('message', (data) => {
	console.log(data)
	const html = Mustache.render(messageTemplate, {
		message: data
	})
	messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) => {
	console.log(url)
	const html = Mustache.render(locationMessageTemplate, {
		url
	})
	messages.insertAdjacentHTML('beforeend', html)
})


form.addEventListener('submit', e => {
	e.preventDefault()

	 formBtn.setAttribute('disabled', 'disabled')

	let text = form.message.value
	socket.emit("sendMessage", text, (error) => {
		formBtn.removeAttribute('disabled')
		formInput.value = ""
		formInput.focus()

		if (error){return console.log(error)}

		console.log("The message was delivered!")
	})
})


locationBtn.addEventListener("click", () => {
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser.')
	}
	locationBtn.setAttribute('disabled', 'disabled')

	navigator.geolocation.getCurrentPosition((position) => {

		socket.emit("sendLocation", {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, (confirmation) => {

			locationBtn.removeAttribute('disabled')

			console.log(confirmation)
		})
	})
})
