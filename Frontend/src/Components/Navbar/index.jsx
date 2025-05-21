import styles from "../Navbar/styles";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {useAuth} from "../../Context/AuthContext";

export default function Index() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const token = localStorage.getItem("token");

        if (storedUsername && token) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <div style={styles.navbar}>
            <div style={styles.leftGroup}>
                <button style={styles.navButton} onClick={() => navigate("/", { state: { mode: "all" } })}>
                    Главная
                </button>
            </div>
            <div style={styles.rightGroup}>
                {user ? (
                    <div style={styles.navButton}>Добро пожаловать, {user.username}</div>
                ) : (
                    <button onClick={() => navigate("/auth")} style={styles.navButton}>
                        Войти
                    </button>
                )}
                <button onClick={() => navigate("/personal")} style={styles.navButton}>
                    Личный кабинет
                </button>
            </div>
        </div>
    );
}
