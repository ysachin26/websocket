
import {WebSocketServer,WebSocket} from 'ws'

//@ts-ignore
const wss = new WebSocketServer({ port : 8080})

interface User
{
    socket:WebSocket
    roomId:string
}
let socketAll : User[] = [];

wss.on("connection",(socket)=>
{
    
    console.log("user connected");

    socket.on('message',(message)=>
    {
        //parse the message

        try{
                const parsedMessage = JSON.parse(message.toString());
            
                if(parsedMessage.type ==='join')
                {
                   if (!socketAll.some((user) => user.roomId === parsedMessage.payload.roomId)) {
    socket.send("room does not exist");
    
    return;
}

socketAll.push({
    socket,
    roomId: parsedMessage.payload.roomId
});
                

                     console.log("User joined:", parsedMessage.payload.roomId);
                     socket.send("user joined"+ parsedMessage.payload.roomId);

                    }
                    else if(parsedMessage.type==='chat')
                    {
                        //iterate over all socket
                        let currentRoomId = null; 
                        //find the room id of the person
                        for(let i =0;i<socketAll.length;i++)
                        {
                            if(socketAll[i].socket===socket)
                            {                   
                                 //store the room id of the person
                                currentRoomId = socketAll[i].roomId;
                                break;
                            }
                        }

                        for(let i =0;i<socketAll.length;i++)
                        {
                            if(socketAll[i].roomId===currentRoomId)
                            {
                                socketAll[i].socket.send(parsedMessage.payload.message)
                            }
                        }
                    //send to all person with same room id


                }
                else if(parsedMessage.type==='create_room')
                {
                   //check does room id already exist
                   //if not then push if exist throw error

                   if(!socketAll.some((e) => e.roomId === parsedMessage.payload.roomId))
                   {
                        socketAll.push(
                        {
                        socket:socket,
                        roomId:parsedMessage.payload.roomId
                        }
                        
                    );
                   }
                   else{
                    //throw error room already exist
                    socket.send(
                        "room already exist"
                    )
                   }
                   
                }
                else if(parsedMessage.type==='leave_room')
                {
                     //extract the roomid 
                     const roomId = parsedMessage?.payload?.roomId;

                     if(!roomId)
                        {
                            socket.send("roomId is required")
                            return;
                        } 

                        const before = socketAll.length

                        //remove from specific room
                        socketAll = socketAll.filter(
                            (user)=>!(user.socket===socket && user.roomId===roomId)

                        );
                         if (socketAll.length === before) {
    socket.send("you are not in this room");
    return;
  }

  socket.send("left room " + roomId);
  console.log("User left:", roomId);

                }
        }
        catch(error)
        {
            console.log("invalid message" + error)
        }
        
    })

    socket.on("close",()=>
    {
        socketAll = socketAll.filter((e)=>e.socket!=socket);
    })

})