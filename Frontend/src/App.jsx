import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/Auth";
import RegisterPage from "./Pages/Register"
import MainPage from "./Pages/Main"
import PersonalPage from "./Pages/Personal";
import {ToastProvider} from "./Context/ToastContext";
import RegistryPage from "./Pages/Registry";
import Slice from "./Pages/Slice";
import ChartViewer from "./Pages/ChartView";
function App() {
    return (
        <Router>
            <ToastProvider>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<MainPage />} />
                    <Route path="/personal" element={<PersonalPage />} />
                    <Route path="/registry/:id" element={<RegistryPage />} />
                    <Route path="/slice/:id" element={<Slice />} />
                    <Route path="/chart-viewer" element={<ChartViewer />} />
                </Routes>
            </ToastProvider>
        </Router>
    );
}

export default App;