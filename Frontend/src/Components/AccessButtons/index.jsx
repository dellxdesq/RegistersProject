import styles from "../AccessButtons/styles";
import GrantedAccessModal from "../../Modals/GrantedAccess";
import { useNavigate } from "react-router-dom";
import {useState} from "react";

export default function AccessButtons() {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    return (
        <div style={styles.rightPanel}>
            <button
                style={styles.rightButton}
                onClick={() => setModalOpen(true)}>
                Выданные доступы
            </button>
            <GrantedAccessModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}/>
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
