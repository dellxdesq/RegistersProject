import styles from "./styles";
import Navbar from "../../Components/Navbar";
import PersonalInfo from "../../Components/PersonalInfo";
import AccessButtons from "../../Components/AccessButtons";
import { useNavigate } from "react-router-dom";

export default function PersonalPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        navigate("/auth");
    };

    const handleChangePassword = () => {
        navigate("/change-password");
    };

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.contentWrapper}>
                <PersonalInfo
                    organization="[Организация]"
                    firstName="[Имя]"
                    lastName="[Фамилия]"
                    email="email@example.com"
                    onChangePassword={handleChangePassword}
                    onLogout={handleLogout}
                />
                <AccessButtons />
            </div>
        </div>
    );
}
