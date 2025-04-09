import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/Auth";
import RegisterPage from "./Pages/Register"
import MainPage from "./Pages/Main"
import PersonalPage from "./Pages/Personal";
function App() {
  return (
      <Router>
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<MainPage />} />
            <Route path="/personal" element={<PersonalPage />} />
        </Routes>
      </Router>
  );
}

export default App;