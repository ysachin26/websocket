 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenerateRoomCode } from "../utility/GenerateRoomCode";
import socket from "../socket";

export function JoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [genCode, setGenCode] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    const roomId = roomCode.trim();
    if (!roomId) return;

    navigate("/chat", { state: { roomId } });
  };

  const createRoom = () => {
    const code = GenerateRoomCode();
    setGenCode(code);

    const sendCreateRoom = () => {
      socket.send(
        JSON.stringify({
          type: "create_room",
          payload: { code },
        })
      );
    };

    if (socket.readyState === WebSocket.OPEN) {
      sendCreateRoom();
    } else {
      socket.addEventListener("open", sendCreateRoom, { once: true });
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center p-4 m-4">
      <div className="">
        <p>Join the room and have fun</p>
        <div className="flex">
          <div className="rounded bg-black-200">
            <input
              className="px-[30px] py-[15px] roundedy-[10px]"
              type="text"
              placeholder="enter room id"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
          </div>
          <div>
            <button className="px-[30px] py-[15px] rounded-lg" onClick={joinRoom}>Join</button>
          </div>
        </div>
      </div>

      <button onClick={createRoom}>create a rooms</button>
      <span>{genCode}</span>
    </div>
  );
}