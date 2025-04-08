import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/Auth";
import RegisterPage from "./Pages/Register"
function App() {
  return (
      <Router>
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
  );
}

export default App;