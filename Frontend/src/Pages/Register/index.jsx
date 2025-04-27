import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles";
import { useToast } from "../../Context/ToastContext";
import RegisterForm from "../../Components/RegisterForm";
import { registerUser } from "../../Api/registerUser";

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
            const result = await registerUser({ username, email, password });

            if (!result.success) {
                setError(result.error);
                return;
            }

            localStorage.setItem("token", result.data.token);
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
                <RegisterForm
                    email={email}
                    setEmail={setEmail}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    repeatPassword={repeatPassword}
                    setRepeatPassword={setRepeatPassword}
                    error={error}
                    onSubmit={handleRegister}
                />
            </div>
        </div>
    );
}
