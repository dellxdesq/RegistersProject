import styles from "../AccessButtons/styles";
import stylesMain from "../PersonalInfo/styles";
import GrantedAccessModal from "../../Modals/GrantedAccess";
import RequestedAccessModal from "../../Modals/RequestedAccess";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AccessButtons() {
    const navigate = useNavigate();
    const [isGrantedModalOpen, setGrantedModalOpen] = useState(false);
    const [isRequestedModalOpen, setRequestedModalOpen] = useState(false);

    return (
        <div style={stylesMain.container}>
            <div style={styles.rightPanel}>
                <button
                    style={styles.rightButton}
                    onClick={() => setGrantedModalOpen(true)}>
                    Выданные доступы
                </button>
                <GrantedAccessModal
                    isOpen={isGrantedModalOpen}
                    onClose={() => setGrantedModalOpen(false)}
                />

                <button
                    style={styles.rightButton}
                    onClick={() => setRequestedModalOpen(true)}> {}
                    Запрошенные доступы
                </button>
                <RequestedAccessModal
                    isOpen={isRequestedModalOpen}
                    onClose={() => setRequestedModalOpen(false)}
                />

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
        </div>
    );
}
