import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles";
import { useToast } from "../../Context/ToastContext";
import AuthButton from "../../Components/AuthButton"

export default function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    const { showToast } = useToast();

    const handleRegister = async (e) => {
        e.preventDefault();

        
        if (password !== repeatPassword) {
            showToast("Пароли не совпадают");
            return;
        }

        setError("");

        try {
            const response = await fetch("https://localhost:8081/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                setError(errorText || "Ошибка регистрации");
                return;
            }
            
            const data = await response.json();
            localStorage.setItem("auth_token", data.token);
            navigate("/auth");
        } catch (err) {
            setError("Ошибка подключения к серверу");
            console.error(err);
        }
    };


    return (
        <div style={styles.registerPage}>
            <div style={styles.registerContainer}>
                <h1 style={styles.registerTitle}>Регистрация</h1>
                <form onSubmit={handleRegister}>
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
                            <p style={{color: "red", marginTop: "5px", fontSize: "14px"}}>
                                {error}
                            </p>
                        )}
                    </div>

                </form>
                <form onSubmit={handleRegister}>
                    <AuthButton text="Регистрация" type="submit"/>
                </form>
            </div>
        </div>
    );
}
