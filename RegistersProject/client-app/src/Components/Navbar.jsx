import styles from "../Pages/Main/styles";

export default function Navbar() {
    return (
        <div style={styles.navbar}>
            <button style={styles.navButton}>Главная</button>
            <button style={styles.navButton}>Личный кабинет</button>
        </div>
    );
}