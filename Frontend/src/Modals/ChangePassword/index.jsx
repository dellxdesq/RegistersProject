import { useState } from "react";
import { changePassword } from "../../Api/changeUserPassword";
import styles from "./styles";

export default function ChangePasswordModal({ onClose }) {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [message, setMessage] = useState(null);

    const handleSubmit = async () => {
        const res = await changePassword(current, next);
        if (res.success) {
            setMessage("Пароль успешно изменён");
            setTimeout(onClose, 1500);
        } else {
            setMessage("Ошибка: " + res.error);
        }
    };

    return (
        <div style={styles.modal}>
            <h3>Смена пароля</h3>
            <input
                type="password"
                placeholder="Текущий пароль"
                value={current}
                onChange={e => setCurrent(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Новый пароль"
                value={next}
                onChange={e => setNext(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleSubmit} style={styles.button}>Сменить</button>
            {message && <p>{message}</p>}
            <button onClick={onClose} style={styles.cancelButton}>Отмена</button>
        </div>
    );
}
