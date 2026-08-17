import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "../socket";

export function ChatRoom() {
  const location = useLocation();
  const [displayMessage, setDisplayMessage] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
const navigate = useNavigate();
  const roomId = (location.state as { roomId?: string } | null)?.roomId;

  useEffect(() => {
    if (!roomId) return;

    const handleOpen = () => {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: { roomId },
        })
      );
    };

    const handleMessage = (event: MessageEvent) => {
      setDisplayMessage((prev) => [...prev, event.data]);
    };

    if (socket.readyState === WebSocket.OPEN) {
      handleOpen();
    } else {
      socket.addEventListener("open", handleOpen, { once: true });
    }

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
    };
  }, [roomId]);

  const sendMessage = () => {
    const trimmed = inputValue.trim();

    if (!trimmed || !roomId) return;

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: {
          roomId,
          message: trimmed,
        },
      })
    );

    setInputValue("");
  };


  function leaveroom()
  {
       socket.send(
      JSON.stringify({
        type: "leave_room",
        payload: {
          roomId:roomId
        },
      })
    );
      navigate("/join")
  }

  if (!roomId) return <div>Invalid room access.</div>;
 

  return (
    <div className="flex items-center justify-center">
    
      <div className="flex flex-col h-screen w-[600px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayMessage.map((msg, index) => (
            <div key={index} className="bg-blue-500 text-white p-3 rounded-lg w-fit">
              {msg}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-[10px] p-3 bg-white border-gray-200 mb-[20px]">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="type message..."
            className="flex-1 px-[4px] py-[2px] border border-gray-300 rounded-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button onClick={sendMessage}>Send</button>
          <div> <button onClick={leaveroom}>leave room</button></div>
        </div>
      </div>
    </div>
  );
}