import { Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetAvatar from "./pages/SetAvatar";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/set-avatar" element={<SetAvatar />}></Route>
        <Route path="/chat/*" element={<Chat />}></Route>
      </Routes>
    </div>
  );
}

export default App;
