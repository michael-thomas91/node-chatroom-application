// array of objects for each user
// { username, id, room }
const users = []

function addUser({ id, username, room }) {
    room = room.trim().toLowerCase()
    username = username.trim().toLowerCase()

    // validate the data
    if (!username || !room) {
        return { error: 'Username/Room names required!' }
    }
    // validate username
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return { error: 'User with same name in that room already exists!'}
    }
    // store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

function removeUser(id) {
    // find and delete user
    const indexOfUser = users.findIndex((user) => user.id === id)
    if (indexOfUser !== -1) {
        return users.splice(indexOfUser, 1)[0]
    }
}

function getUser(id) {
    return users.find((user) => user.id === id)
}

function getUsersInRoom(room) {
    const usersInRoom = users.filter((user) => user.room === room)
    if (usersInRoom.length === 0) {
        return ('Room doesn\'t exist.')
    }
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}