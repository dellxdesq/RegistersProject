import styles from "../Pages/Main/styles";

export default function SearchList({ value, onChange }) {
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