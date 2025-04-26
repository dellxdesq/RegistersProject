import styles from "./styles";

export default function RegistryInfo({ info }) {
    return (
        <div style={styles.container}>
            <div style={styles.infoItem}><strong>��������:</strong> {info.description}</div>
            <div style={styles.infoItem}><strong>������ �����:</strong> {info.fileFormat}</div>
            <div style={styles.infoItem}><strong>�����������:</strong> {info.organization}</div>
            <div style={styles.infoItem}><strong>���������� �����:</strong> {info.rowsCount}</div>
            <div style={styles.infoItem}><strong>������� �������:</strong> {info.defaultAccessLevel}</div>
        </div>
    );
}
