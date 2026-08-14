import { WebSocketServer } from 'ws';
//@ts-ignore
const wss = new WebSocketServer({ port: 8080 });
const socketAll = [];
wss.on("connection", (socket) => {
    console.log("user connected");
    socket.on('message', (message) => {
        //parse the message
        try {
            const parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.type === 'join') {
                console.log("user under join");
                socketAll.push({
                    socket: socket,
                    roomId: parsedMessage.payload.roomId
                });
                console.log("User joined:", parsedMessage.payload.roomId);
                socket.send("user joined" + parsedMessage.payload.roomId);
            }
            else if (parsedMessage.type === 'chat') {
                //iterate over all socket
                let currentRoomId = null;
                //find the room id of the person
                for (let i = 0; i < socketAll.length; i++) {
                    if (socketAll[i].socket === socket) {
                        //store the room id of the person
                        currentRoomId = socketAll[i].roomId;
                        break;
                    }
                }
                for (let i = 0; i < socketAll.length; i++) {
                    if (socketAll[i].roomId === currentRoomId) {
                        socketAll[i].socket.send(parsedMessage.payload.message);
                    }
                }
                //send to all person with same room id
            }
        }
        catch (error) {
            console.log("invalid message" + error);
        }
    });
});
