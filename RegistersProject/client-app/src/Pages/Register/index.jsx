import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState(""); // состояние для текста ошибки

    const handleRegister = (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setError("Пароли не совпадают");
            return;
        }

        setError("");

        navigate("/auth");
    };

    return (
        <div style={styles.registerPage}>
            <div style={styles.registerContainer}>
                <h1 style={styles.registerTitle}>Регистрация</h1>
                <form onSubmit={handleRegister}>
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
                    <div style={styles.formGroup}>
                        <label htmlFor="repeatPassword">Повтор пароля</label>
                        <input
                            id="repeatPassword"
                            type="password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={styles.input}
                        />
                        {error && (
                            <p style={{ color: "red", marginTop: "5px", fontSize: "14px" }}>
                                {error}
                            </p>
                        )}
                    </div>
                    <button type="submit" style={styles.registerButton}>
                        Регистрация
                    </button>
                </form>
            </div>
        </div>
    );
}
