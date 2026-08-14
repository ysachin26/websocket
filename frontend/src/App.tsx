 

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ChatRoom } from "./component/ChatRoom";
import { JoinPage } from "./component/JoinPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/join" replace />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/chat" element={<ChatRoom />} />
        <Route path="*" element={<Navigate to="/join" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
