import styles from "../PersonalInfo/styles";

export default function PersonalInfo({ organization, firstName, lastName, email, onChangePassword, onLogout }) {
    return (
        <div style={styles.leftPanel}>
            <h2>Личные данные</h2>
            <div style={styles.field}><strong>Организация:</strong> {organization}</div>
            <div style={styles.field}><strong>Имя:</strong> {firstName}</div>
            <div style={styles.field}><strong>Фамилия:</strong> {lastName}</div>
            <div style={styles.field}><strong>Почта:</strong> {email}</div>
            <div style={styles.buttonRow}>
                <button style={styles.actionButton} onClick={onChangePassword}>Сменить пароль</button>
                <button style={styles.logoutButton} onClick={onLogout}>Выход</button>
            </div>
        </div>
    );
}
