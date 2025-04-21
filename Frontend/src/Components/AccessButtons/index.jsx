import styles from "../AccessButtons/styles";
import { useNavigate } from "react-router-dom";

export default function AccessButtons() {
    const navigate = useNavigate();

    return (
        <div style={styles.rightPanel}>
            <button
                style={styles.rightButton}
                onClick={() => navigate("/", { state: { mode: "granted" } })}>
                Выданные доступы
            </button>
            <button
                style={styles.rightButton}
                onClick={() => navigate("/", { state: { mode: "requested" } })}>
                Запрошенные доступы
            </button>
            <button
                style={styles.rightButton}
                onClick={() => navigate("/", { state: { mode: "available" } })}>
                Доступные реестры
            </button>
            <button
                style={styles.rightButton}
                onClick={() => navigate("/", { state: { mode: "uploaded" } })}>
                Загруженные реестры
            </button>
        </div>
    );
}
