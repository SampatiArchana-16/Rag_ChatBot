import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";



import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chatbot from "./pages/Chatbot";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/chat"
          element={<Chatbot />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;