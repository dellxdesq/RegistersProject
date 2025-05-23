import styles from "./styles";

export default function RegistryInfo({ info, onShowFull }) {
    return (
        <div style={styles.container}>

            <div style={styles.infoItem}><strong>Описание:</strong> {info.description}</div>
            <div style={styles.infoItem}><strong>Формат файла:</strong> {info.fileFormat}</div>
            <div style={styles.infoItem}><strong>Организация:</strong> {info.organization}</div>
            <div style={styles.infoItem}><strong>Количество строк:</strong> {info.rowsCount}</div>
            <div style={styles.headerRow}>
                <div><strong>Уровень доступа:</strong> {info.defaultAccessLevel}</div>
                <button onClick={onShowFull} style={styles.fullViewButton}>
                    Показать полностью
                </button>
            </div>
        </div>
    );
}
