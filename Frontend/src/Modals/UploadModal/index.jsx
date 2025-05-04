import { useState } from "react";
import styles from "./styles";
import { addRegistry } from "../../Api/uploadRegistry";
import { getFileFormat } from "../../Utils/getFileFormat";
import { countFileRows } from "../../Utils/countFileRows";
import {uploadRegistryFile} from "../../Api/uploadRegistryS3"
export default function UploadModal({ isOpen, onClose }) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [organization, setOrganization] = useState("");
    const [rowsCount, setRowsCount] = useState("");
    const [fileFormat, setFileFormat] = useState("");
    const [access, setAccess] = useState({
        public: false,
        personal: false,
        org: false,
    });
    const [selectedUsers, setSelectedUsers] = useState("");

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const format = getFileFormat(selectedFile);
            setFileFormat(format);

            try {
                const rows = await countFileRows(selectedFile);
                setRowsCount(rows);
            } catch (error) {
                console.error("Ошибка подсчета строк:", error);
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Токен не найден, авторизуйтесь!');
                return;
            }

            
            const uploadResult = await uploadRegistryFile(file, token);

            
            const requestBody = {
                name: title,
                description: description,
                fileFormat: fileFormat,
                organization: organization,
                rowsCount: Number(rowsCount),
                defaultAccessLevel: access.public ? 1 : access.personal ? 2 : 3,
                fileName: uploadResult.name,
            };

            await addRegistry(requestBody, token);
            alert('Реестр успешно загружен!');
            onClose();
        } catch (error) {
            alert(error.message || 'Ошибка загрузки реестра');
        }
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
                                checked={access.public}
                                onChange={() => setAccess(a => ({...a, public: !a.public}))}
                            /> Публичный доступ
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={access.personal}
                                onChange={() => setAccess(a => ({...a, personal: !a.personal}))}
                            /> Персональный доступ
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={access.org}
                                onChange={() => setAccess(a => ({...a, org: !a.org}))}
                            /> Доступ внутри организации
                        </label>
                    </div>
                    <label>
                        Выбрать людей:
                        <input
                            type="text"
                            value={selectedUsers}
                            onChange={e => setSelectedUsers(e.target.value)}
                            style={styles.input}
                        />
                    </label>
                    <div style={styles.buttons}>
                        <button type="submit" style={styles.upload}>Загрузить</button>
                        <button type="button" onClick={onClose} style={styles.cancel}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
