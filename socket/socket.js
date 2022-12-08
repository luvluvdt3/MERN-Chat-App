const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})


let users = []; //list of current online users
const addUser = (userId, socketId, userInfo) => { //add new onl users into the list
    const checkUser = users.some(u => u.userId === userId);
    if (!checkUser) { //if the user is not already in the onl list
        users.push({ userId, socketId, userInfo });
    }
}

const userRemove = (socketId) => {
    users = users.filter(u => u.socketId !== socketId);
} //each user have a different socketId-> update new user list without the user with a certain socketId

const findFriend = (id) => { //find user in the online users list with the same id
    return users.find(u => u.userId === id); //if user is online then return his info, else return undefined
}

io.on('connection', (socket) => {
    console.log('Socket is connecting...')
    //receive the newly online user's info sent by frontend
    socket.on('addUser', (userId, userInfo) => { //activated every time frontend send new onl user (in Messenger component)
        //console.log(userId) //every time a new user become active or reload the page-> print out in terminal of socket his ID
        //console.log(userInfo) //da same but with every infos 
        addUser(userId, socket.id, userInfo);
        io.emit('getUser', users); //send the new list of onl users back to frontend
    })

    socket.on('disconnect', () => {
        console.log('user is disconnect... '); //in socket terminal
        userRemove(socket.id);
        io.emit('getUser', users);
    })

    socket.on('sendMessage', (data) => {
        const user = findFriend(data.reseverId);
        // console.log(user); //userId,socketIdmuserInfo,...
        if (user !== undefined) { //if the user is online
            //send message through the user's socket to the frontend (only this user will receive it)
            socket.to(user.socketId).emit('getMessage', data)
        }
    })

    socket.on('messageSeen', msg => {
        const user = findFriend(msg.senderId);
        if (user !== undefined) {
            socket.to(user.socketId).emit('msgSeenResponse', msg)
        }
    })

    socket.on('delivaredMessage',msg =>{
        const user = findFriend(msg.senderId);          
        if(user !== undefined){
             socket.to(user.socketId).emit('msgDelivaredResponse', msg)
        }          
   })

    //for typing '...' event
    socket.on('typingMessage', (data) => { //when receive event named typingMessage from the frontend
        //console.log(data) //reseverId, senderId, msg
        const user = findFriend(data.reseverId); //check if receiver user is in the online users list
        if (user !== undefined) { //if user is online
            socket.to(user.socketId).emit('typingMessageGet', {//send the typing event to receiver's socket
                senderId: data.senderId,
                reseverId: data.reseverId,
                msg: data.msg
            })
        }
    })

    socket.on('seen',data =>{ //custom event when a message is read -> update status in sender's side
        const user = findFriend(data.senderId);          
        if(user !== undefined){
             socket.to(user.socketId).emit('seenSuccess', data) //send to sender's socket seen message info to update the icon status delivared->seen in real time
        } 
   })


})