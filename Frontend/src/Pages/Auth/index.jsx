import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles";
import { useToast } from "../../Context/ToastContext";
import LoginForm from "../../Components/LoginForm";
import { loginUser } from "../../Api/loginUser";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { showToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await loginUser({ username, password });

        if (!result.success) {
            showToast(result.error);
            return;
        }

        localStorage.setItem("token", result.data.token);
        localStorage.setItem("username", username);
        navigate("/");
    };

    return (
        <div style={styles.loginPage}>
            <div style={styles.loginContainer}>
                <h1 style={styles.loginTitle}>Добро пожаловать</h1>
                <LoginForm
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    onSubmit={handleLogin}
                />
                <div style={styles.registerLink}>
                    <button
                        onClick={() => navigate("/register")}
                        style={{ background: "none", border: "none", color: "#7f00ff", cursor: "pointer" }}
                    >
                        Регистрация
                    </button>
                </div>
            </div>
        </div>
    );
}
