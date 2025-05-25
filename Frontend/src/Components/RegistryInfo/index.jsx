import { useState } from "react";
import styles from "./styles";

export default function RegistryInfo({ info, onShowFull }) {
    const [showDescription, setShowDescription] = useState(false);
    const isLong = info.description?.length > 100;

    return (
        <div style={styles.container}>
            <div style={styles.infoRow}>
                <div style={styles.infoItem}><strong>Формат файла:</strong> {info.fileFormat}</div>
                <div style={styles.infoItem}><strong>Количество строк:</strong> {info.rowsCount}</div>
                <div style={styles.infoItem}><strong>Организация:</strong> {info.organization}</div>
            </div>

            <div
                style={{
                    ...styles.descriptionRow,
                    cursor: isLong ? "pointer" : "default",
                }}
                onClick={() => isLong && setShowDescription(true)}
                title={isLong ? "Нажмите, чтобы увидеть полностью" : ""}
            >
                <strong>Описание:</strong>
                <span style={styles.descriptionText}>
                    {isLong ? info.description.slice(0, 100) + "..." : info.description}
                </span>
            </div>

            <div style={styles.buttonRow}>
                <button onClick={onShowFull} style={styles.fullViewButton}>
                    Открыть реестр полностью
                </button>
            </div>

            {showDescription && (
                <div style={styles.modalOverlay} onClick={() => setShowDescription(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>Полное описание</h3>
                        <p>{info.description}</p>
                        <button style={styles.closeButton} onClick={() => setShowDescription(false)}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
}
