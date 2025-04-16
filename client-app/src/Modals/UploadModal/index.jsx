import { useState } from "react";
import styles from "./styles.module.css";

export default function UploadModal({ isOpen, onClose }) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [access, setAccess] = useState({
        public: false,
        personal: false,
        org: false,
    });
    const [selectedUsers, setSelectedUsers] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ title, file, description, access, selectedUsers });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Загрузка реестра</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>
                        Название:
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                    </label>
                    <label>
                        Файл:
                        <input type="file" onChange={e => setFile(e.target.files[0])} required />
                    </label>
                    <label>
                        Описание:
                        <textarea value={description} onChange={e => setDescription(e.target.value)} />
                    </label>
                    <div className={styles.checkboxGroup}>
                        <label><input type="checkbox" checked={access.public} onChange={() => setAccess(a => ({...a, public: !a.public}))} /> Публичный доступ</label>
                        <label><input type="checkbox" checked={access.personal} onChange={() => setAccess(a => ({...a, personal: !a.personal}))} /> Персональный доступ</label>
                        <label><input type="checkbox" checked={access.org} onChange={() => setAccess(a => ({...a, org: !a.org}))} /> Доступ внутри организации</label>
                    </div>
                    <label>
                        Выбрать людей:
                        <input type="text" value={selectedUsers} onChange={e => setSelectedUsers(e.target.value)} />
                    </label>
                    <div className={styles.buttons}>
                        <button type="submit" className={styles.upload}>Загрузить</button>
                        <button type="button" onClick={onClose} className={styles.cancel}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
