import { useEffect, useRef, useState } from "react"

 

function App() {

  const socketRef = useRef<WebSocket | null>(null);
  const [displaymessage, setDisplayMessage] =useState<string[]>([])
  const [inputvalue , setInputValue] = useState("");

  function sendMessage()
 {
  
     const socket = socketRef.current;
     if(!socket) return;

     const message = inputvalue;
     
     if(!message) return;
     socket.send(message);
     setInputValue("");
 }
 
 useEffect(()=>
{
  const wss = new WebSocket('ws://localhost:8080')
  socketRef.current = wss;
  wss.onmessage = (event)=>
  {
    setDisplayMessage((prev)=>[...prev,event.data])
  }

},[])
  return (
    <>
    <div className='flex  items-center justify-center'>

   
    <div className="flex flex-col auto h-screen w-[600px]  " >
    
     <div className='flex-1 overflow-y-auto p-4 space-y-4'>

          {displaymessage.map((msg, index) => (
            <div className='bg-blue-500 text-white p-3 rounded-lg w-fit' key={index}>{msg}</div>
          ))}
     </div>

     <div className='flex items-center gap-[10px] p-3 bg-white border-grey-200 mb-[20px]'>
       <input  className=' flex-1 px-4 py-2 border border-gray-300 pt-[10px] pb-[10px] w-[80%] rounded-lg focus:outline-none focus:ring-blue-500' 
    placeholder='type message...' type="text" onClick={sendMessage}  value={inputvalue}
     onChange={(e)=>setInputValue(e.target.value)}></input>
       
      
      <button className='rounded-lg border-2 m-2 pr-5 pl-5 pt-2 pb-2 rounded pt-[10px] pb-[10px] pr-[30px] pl-[30px] ' >Send</button>
     </div>
     
      </div>
     </div>
    </>
  )
}

export default App
