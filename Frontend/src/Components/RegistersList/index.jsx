import styles from "./styles";
export default function RegistersList({ items }) {
    return (
        <div style={styles.listContainer}>
            {items.map((item, index) => (
                <div key={index} style={styles.listItem}>
                    {item}
                </div>
            ))}
        </div>
    );
}