import styles from "../Navbar/styles";
import { useNavigate } from "react-router-dom";

export default function Index() {
    const navigate = useNavigate();

    return (
        <div style={styles.navbar}>
            <div style={styles.leftGroup}>
                <button style={styles.navButton} onClick={() => navigate("/")}>
                    Главная
                </button>
            </div>
            <div style={styles.rightGroup}>
                <button onClick={() => navigate("/auth")} style={styles.navButton}>
                    Войти
                </button>
                <button onClick={() => navigate("/personal")} style={styles.navButton}>
                    Личный кабинет
                </button>
            </div>
        </div>
    );
}