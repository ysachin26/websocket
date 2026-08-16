
import {WebSocketServer,WebSocket} from 'ws'

//@ts-ignore
const wss = new WebSocketServer({ port : 8080})

interface User
{
    socket:WebSocket
    roomId:string
}
const socketAll : User[] = [];

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
                    console.log("user under join")
                    socketAll.push(
                        {
                        socket:socket,
                        roomId:parsedMessage.payload.roomId
                        }
                        
                    );

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


                }else if(parsedMessage.type==='create_room')
                {
                   //check does room id already exist
                   //if not then push if exist throw error

                   if(!socketAll.find(parsedMessage.payload.code))
                   {
                        socketAll.push(
                        {
                        socket:socket,
                        roomId:parsedMessage.payload.code
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
        }
        catch(error)
        {
            console.log("invalid message" + error)
        }
        
    })

})