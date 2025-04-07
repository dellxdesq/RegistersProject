import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/");
    };

    return (
        <div style={styles.loginPage}>
            <div style={styles.loginContainer}>
                <h1 style={styles.loginTitle}>Добро пожаловать</h1>
                <form onSubmit={handleLogin}>
                    <div style={styles.formGroup}>
                        <label htmlFor="email">Почта</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
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
                    <button type="submit" style={styles.loginButton}>
                        Вход
                    </button>
                </form>
                <div style={styles.registerLink}>
                    <button onClick={() => navigate("/register")} style={{ background: "none", border: "none", color: "#7f00ff", cursor: "pointer" }}>
                        Регистрация
                    </button>
                </div>
            </div>
        </div>
    );
}
