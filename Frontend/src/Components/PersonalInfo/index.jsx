import { useState } from "react";
import styles from "../PersonalInfo/styles";

export default function PersonalInfo({ organization, firstName, lastName, email, onChangePassword, onLogout }) {
    const [formData, setFormData] = useState({ organization, firstName, lastName, email });
    const [editing, setEditing] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleEdit = () => {
        if (editing) {
            console.log("Сохраняем изменения:", formData);
        }
        setEditing(prev => !prev);
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftPanel}>
                <h2>Личные данные</h2>

                <div style={styles.field}>
                    <strong>Организация:</strong> {editing ? (
                    <input
                        type="text"
                        value={formData.organization}
                        onChange={e => handleChange("organization", e.target.value)}
                        style={styles.input}
                    />
                ) : (
                    <span style={styles.span}>{formData.organization}</span>
                )}
                </div>

                <div style={styles.field}>
                    <strong>Имя:</strong> {editing ? (
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={e => handleChange("firstName", e.target.value)}
                        style={styles.input}
                    />
                ) : (
                    <span style={styles.span}>{formData.firstName}</span>
                )}
                </div>

                <div style={styles.field}>
                    <strong>Фамилия:</strong> {editing ? (
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={e => handleChange("lastName", e.target.value)}
                        style={styles.input}
                    />
                ) : (
                    <span style={styles.span}>{formData.lastName}</span>
                )}
                </div>

                <div style={styles.field}>
                    <strong>Почта:</strong> {editing ? (
                    <input
                        type="email"
                        value={formData.email}
                        onChange={e => handleChange("email", e.target.value)}
                        style={styles.input}
                    />
                ) : (
                    <span style={styles.span}>{formData.email}</span>
                )}
                </div>

                <div style={styles.buttonRow}>
                    <button style={styles.actionButton} onClick={onChangePassword}>Сменить пароль</button>
                    <button
                        style={{
                            ...styles.actionButton,
                            backgroundColor: editing ? "#28a745" : "#6c757d",
                        }}
                        onClick={toggleEdit}
                    >
                        {editing ? "Сохранить" : "Редактировать"}
                    </button>
                    <button style={styles.logoutButton} onClick={onLogout}>Выход</button>
                </div>
            </div>
        </div>
    );
}
