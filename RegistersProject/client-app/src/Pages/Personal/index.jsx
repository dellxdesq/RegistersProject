import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles";
import Navbar from "../../Components/Navbar";

export default function PersonalPage() {
    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.contentWrapper}>
                <div style={styles.leftPanel}>
                    <h2>Личные данные</h2>
                    <div style={styles.field}><strong>Организация:</strong> [Организация]</div>
                    <div style={styles.field}><strong>Имя:</strong> [Имя]</div>
                    <div style={styles.field}><strong>Фамилия:</strong> [Фамилия]</div>
                    <div style={styles.field}><strong>Почта:</strong> [email@example.com]</div>
                    <div style={styles.buttonRow}>
                        <button style={styles.actionButton}>Сменить пароль</button>
                        <button style={styles.logoutButton}>Выход</button>
                    </div>
                </div>

                <div style={styles.rightPanel}>
                    <button style={styles.rightButton}>Выданные доступы</button>
                    <button style={styles.rightButton}>Запрошенные доступы</button>
                    <button style={styles.rightButton}>Доступные реестры</button>
                    <button style={styles.rightButton}>Загруженные реестры</button>
                </div>
            </div>
        </div>
    );
}
