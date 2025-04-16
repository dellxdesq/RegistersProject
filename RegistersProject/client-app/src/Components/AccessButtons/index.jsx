import styles from "../AccessButtons/styles";

export default function AccessButtons() {
    return (
        <div style={styles.rightPanel}>
            <button style={styles.rightButton}>Выданные доступы</button>
            <button style={styles.rightButton}>Запрошенные доступы</button>
            <button style={styles.rightButton}>Доступные реестры</button>
            <button style={styles.rightButton}>Загруженные реестры</button>
        </div>
    );
}
