import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenerateRoomCode } from "../utility/GenerateRoomCode";
import socket from "../socket";

export function JoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [genCode, setGenCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const navigate = useNavigate();

  const joinRoom = () => {
    const roomId = roomCode.trim();
    if (!roomId || isJoining) return;

    setJoinError("");
    setIsJoining(true);

    const handleJoinResult = (event: MessageEvent) => {
      const msg = String(event.data);

      if (msg === "room does not exist") {
        setJoinError("Room does not exist");
        setIsJoining(false);
        socket.removeEventListener("message", handleJoinResult);
        return;
      }

      if (msg.startsWith("user joined")) {
        setIsJoining(false);
        socket.removeEventListener("message", handleJoinResult);
        navigate("/chat", { state: { roomId } });
      }
    };

    socket.addEventListener("message", handleJoinResult);

    const sendJoin = () => {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: { roomId },
        })
      );
    };

    if (socket.readyState === WebSocket.OPEN) {
      sendJoin();
    } else {
      socket.addEventListener("open", sendJoin, { once: true });
    }
  };

  const createRoom = () => {
    const roomId = GenerateRoomCode();
    setGenCode(roomId);

    const sendCreateRoom = () => {
      socket.send(
        JSON.stringify({
          type: "create_room",
          payload: { roomId },
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
      <div>
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
            <button
              className="px-[30px] py-[15px] rounded-lg"
              onClick={joinRoom}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join"}
            </button>
          </div>
        </div>
        {joinError && <p className="text-red-600 mt-2">{joinError}</p>}
      </div>

      <button onClick={createRoom}>create a rooms</button>
      <span>{genCode}</span>
    </div>
  );
}