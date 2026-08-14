import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function JoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    const roomId = roomCode.trim();
    if (!roomId) return;

    navigate("/chat", { state: { roomId } });
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <input
        type="text"
        placeholder="enter room id"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <button onClick={joinRoom}>Join</button>
    </div>
  );
}