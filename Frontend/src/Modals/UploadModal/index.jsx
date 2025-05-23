import {use, useState} from "react";
import styles from "./styles";
import { addRegistry } from "../../Api/Registries/uploadRegistry";
import { getFileFormat } from "../../Utils/getFileFormat";
import { countFileRows } from "../../Utils/countFileRows";
import {uploadRegistryFile} from "../../Api/Registries/uploadRegistryS3"
export default function UploadModal({ isOpen, onClose }) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [organization, setOrganization] = useState("");
    const [accessLevel, setAccessLevel] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentUserInput, setCurrentUserInput] = useState("");
    
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('access_token');

            if (!token) {
                alert('Токен не найден, авторизуйтесь!');
                return;
            }
            
            const uploadResult = await uploadRegistryFile(file, token);
            
            const requestBody = {
                name: title,
                description: description,
                organization: organization,
                defaultAccessLevel: accessLevel,
                fileName: uploadResult.fileName,
                userLoginsWithAccess: selectedUsers,
            };

            await addRegistry(requestBody, token);
            alert('Реестр успешно загружен!');
            console.log(selectedUsers);
            onClose();
            
        } catch (error) {
            alert(error.message || 'Ошибка загрузки реестра');
        }
    };

    const handleAddUser = () => {
        const trimmed = currentUserInput.trim();
        if (trimmed && !selectedUsers.includes(trimmed)) {
            setSelectedUsers(prev => [...prev, trimmed]);
            setCurrentUserInput("");
        }
    };

    const handleRemoveUser = (user) => {
        setSelectedUsers(prev => prev.filter(u => u !== user));
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Загрузка реестра</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label>
                        Название:
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </label>
                    <label>
                        Файл:
                        <input
                            type="file"
                            onChange={handleFileChange}
                            required
                            style={styles.input}
                        />
                    </label>
                    <label>
                        Описание:
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={styles.textarea}
                        />
                    </label>
                    <label>
                        Организация:
                        <input
                            type="text"
                            value={organization}
                            onChange={e => setOrganization(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </label>
                    <div style={styles.checkboxGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={accessLevel === 1}
                                onChange={() => setAccessLevel(1)}
                            /> Публичный доступ
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={accessLevel === 2}
                                onChange={() => setAccessLevel(2)}
                            /> Персональный доступ
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={accessLevel === 3}
                                onChange={() => setAccessLevel(3)}
                            /> Доступ внутри организации
                        </label>
                    </div>
                    {(accessLevel === 3) && (
                        <>
                            <label>
                                Выбрать людей:
                                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                                    <input
                                        type="text"
                                        value={currentUserInput}
                                        onChange={e => setCurrentUserInput(e.target.value)}
                                        style={{ ...styles.input, flex: 1 }}
                                    />
                                    <button type="button" onClick={handleAddUser} style={styles.addButton}>
                                        Добавить
                                    </button>
                                </div>
                            </label>

                            {selectedUsers.length > 0 && (
                                <div style={styles.userList}>
                                    {selectedUsers.map((user, index) => (
                                        <div key={index} style={styles.userItem}>
                                            <span>{user}</span>
                                            <button type="button" onClick={() => handleRemoveUser(user)} style={styles.removeButton}>
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    

                    <div style={styles.buttons}>
                        <button type="submit" style={styles.upload}>Загрузить</button>
                        <button type="button" onClick={onClose} style={styles.cancel}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
