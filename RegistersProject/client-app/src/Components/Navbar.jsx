import styles from "../Pages/Main/styles";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <div style={styles.navbar}>
            <button style={styles.navButton} onClick={() => navigate("/")}>
                Главная
            </button>
            <button onClick={() => navigate("/personal")} style={styles.navButton}>
                Личный кабинет
            </button>
        </div>
    );
}