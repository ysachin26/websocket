import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export function ChatRoom() {
  const location = useLocation();
  const socketRef = useRef<WebSocket | null>(null);
  const [displayMessage, setDisplayMessage] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const roomId = (location.state as { roomId?: string } | null)?.roomId;

  useEffect(() => {
    if (!roomId) return;

    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: { roomId },
        })
      );
    };

    socket.onmessage = (event) => {
      setDisplayMessage((prev) => [...prev, event.data]);
    };

    return () => {
      socket.close();
    };
  }, [roomId]);

  const sendMessage = () => {
    const socket = socketRef.current;
    const trimmed = inputValue.trim();

    if (!socket || !trimmed || !roomId) return;

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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}