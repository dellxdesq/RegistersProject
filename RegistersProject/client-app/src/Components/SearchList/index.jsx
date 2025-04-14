import styles from "../SearchList/styles";

export default function Index({ value, onChange }) {
    return (
        <input
            type="text"
            placeholder="Введите название нужного реестра..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={styles.searchInput}
        />
    );
}