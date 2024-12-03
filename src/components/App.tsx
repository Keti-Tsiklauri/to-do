import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import Main from "./Main";
import { AuthProvider } from "../context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
