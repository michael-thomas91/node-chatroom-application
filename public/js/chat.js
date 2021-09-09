const socket = io()

// Elements
const messageForm = document.getElementById('message-form')
const messageFormInput = messageForm.querySelector('input')
const messageFormBtn = messageForm.querySelector('button')
const sendLocationBtn = document.getElementById('share-location')
const messages = document.getElementById('messages')
const sidebar = document.getElementsByClassName('chat__sidebar')[0]

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

//this returns an object with the key value pairs from the query string
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // get message element
    const newMessage = messages.lastElementChild
    // height of last newMessage
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = messages.offsetHeight
    const containerHeight = messages.scrollHeight
    const scrollOffset = messages.scrollTop + visibleHeight

}

// event listeners
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    messageFormBtn.setAttribute('disabled', 'disabled')

    const textField = e.target.elements.message
    const message = textField.value
    

    socket.emit('sendMessage', message, (message) => {
        messageFormBtn.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()
        console.log('Delivered', message)
    })
})

document.getElementById('share-location').addEventListener('click', () => {
    sendLocationBtn.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('Location services are not supported on this browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            sendLocationBtn.removeAttribute('disabled')
            console.log('Location Sent!')
        })
    })
})
// socket listeners
socket.on('message', (message) => {
    console.log(message.createdAt)
    const html = Mustache.render(messageTemplate, { 
        user: message.user,
        timeStamp: message.createdAt, 
        message: message.text
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('location', (url) => {
    const locationUrl = url.locationURL
    const html = Mustache.render(locationTemplate, {
        user: url.user,
        timeStamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
        locationUrl})
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    sidebar.innerHTML = html
})
// error handlers
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})








