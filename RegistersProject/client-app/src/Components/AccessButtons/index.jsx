import styles from "../AccessButtons/styles";
import { useNavigate } from "react-router-dom";

export default function AccessButtons() {
    const navigate = useNavigate();
    return (
        <div style={styles.rightPanel}>
            <button
                style={styles.rightButton}
                onClick={() => navigate("/auth")}>
                Выданные доступы
            </button>
            <button
                style={styles.rightButton}
                onClick={() => navigate("/auth")}>
                Запрошенные доступы
            </button>
            <button
                style={styles.rightButton}
                onClick={() => navigate("/auth")}>
                Доступные реестры
            </button>
            <button
                style={styles.rightButton}
                onClick={() => navigate("/loadedRegisters")}>
                Загруженные реестры
            </button>
        </div>
    );
}
