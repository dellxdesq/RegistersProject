import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles";
import { useToast } from "../../Context/ToastContext";
import AuthButton from "../../Components/AuthButton"

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { showToast } = useToast();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("https://localhost:8081/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                showToast("Логин или пароль не верный")
                return;
            }

            const data = await response.json();
            localStorage.setItem("auth_token", data.token);
            navigate("/");
        } catch (err) {
            
            console.error(err);
        }
    };

    return (
        <div style={styles.loginPage}>
            <div style={styles.loginContainer}>
                <h1 style={styles.loginTitle}>Добро пожаловать</h1>
                <form onSubmit={handleLogin}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username">Логин</label>
                        <input
                            id="username"
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="username"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={styles.input}
                        />
                    </div>
                </form>
                <form onSubmit={handleLogin}>
                    <AuthButton text="Вход" type="submit"/>
                </form>
                <div style={styles.registerLink}>
                    <button onClick={() => navigate("/register")}
                            style={{background: "none", border: "none", color: "#7f00ff", cursor: "pointer"}}>
                        Регистрация
                    </button>
                </div>
            </div>
        </div>
    );
}
