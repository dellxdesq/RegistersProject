import styles from "../Navbar/styles";
import { useNavigate } from "react-router-dom";

export default function Index() {
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