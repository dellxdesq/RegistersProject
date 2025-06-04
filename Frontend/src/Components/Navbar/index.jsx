import styles from "../Navbar/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function Index() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div style={styles.navbar}>
            <div style={styles.leftGroup}>
                <button style={styles.navButton} onClick={() => navigate("/", { state: { mode: "all" } })}>
                    Главная
                </button>
            </div>
            <div style={styles.rightGroup}>
                {user ? (
                    <div style={styles.welcomeText}>
                        Добро пожаловать, {user.firstName} {user.lastName}
                    </div>
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
