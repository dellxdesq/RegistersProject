import { useState, useEffect } from "react";
import styles from "../PersonalInfo/styles";
import { getProfile } from "../../Api/getUserProfileInfo";
import { updateProfile } from "../../Api/changeUserProfile";
import ChangePasswordModal from "../../Modals/ChangePassword"
import {logout} from "../../Api/logoutUser"
import {useAuth} from "../../Context/AuthContext";
export default function PersonalInfo({ onChangePassword, onLogout }) {
    const [formData, setFormData] = useState({
        organization: "",
        firstName: "",
        lastName: "",
        email: "",
    });
    const [editing, setEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    
    useEffect(() => {
        getProfile().then(res => {
            if (res.success) {
                setFormData({
                    organization: res.data.organization || "",
                    firstName: res.data.firstName || "",
                    lastName: res.data.lastName || "",
                    email: res.data.email || "",
                });
            } else {
                alert("Ошибка при загрузке профиля: " + res.error);
            }
        });
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleEdit = async () => {
        if (editing) {
            const res = await updateProfile(formData);
            if (!res.success) {
                alert("Ошибка при сохранении: " + res.error);
                return;
            }
        }
        setEditing(prev => !prev);
    };

    const { logout: logoutFromContext } = useAuth();

    const handleLogout = async () => {
        const res = await logout();
        if (res.success) {
            logoutFromContext();
            if (onLogout) {
                onLogout();
            } else {
                window.location.href = "/login";
            }
        } else {
            alert("Ошибка при выходе: " + res.error);
        }
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
                    <button style={styles.actionButton} onClick={() => setShowPasswordModal(true)}>Сменить пароль
                    </button>
                    <button
                        style={{
                            ...styles.actionButton,
                            backgroundColor: editing ? "#28a745" : "#6c757d",
                        }}
                        onClick={toggleEdit}
                    >
                        {editing ? "Сохранить" : "Редактировать"}
                    </button>
                    <button style={styles.logoutButton} onClick={handleLogout}>Выход</button>
                </div>
            </div>
            {showPasswordModal && (
                <div style={styles.overlay}>
                    <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
                </div>
            )}
        </div>
        
        
        
    );
}
