import { useState } from "react";
import styles from "./styles";

export default function ChartModal({ isOpen, onClose, headers }) {
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [rowsInput, setRowsInput] = useState("");

    const toggleColumn = (header) => {
        setSelectedColumns((prev) =>
            prev.includes(header)
                ? prev.filter((h) => h !== header)
                : [...prev, header]
        );
    };

    const handleSubmit = () => {
        console.log("Строим график по колонкам:", selectedColumns);
        console.log("И строкам:", rowsInput);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeButton} onClick={onClose}>×</button>
                <h2>Выберите столбцы и строки</h2>

                <div style={styles.section}>
                    <p>Столбцы:</p>
                    <div style={styles.list}>
                        {headers.map((header) => (
                            <label key={header} style={styles.item}>
                                <input
                                    type="checkbox"
                                    checked={selectedColumns.includes(header)}
                                    onChange={() => toggleColumn(header)}
                                />
                                {header}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={styles.section}>
                    <p>Строки (номера через запятую):</p>
                    <input
                        type="text"
                        style={styles.input}
                        value={rowsInput}
                        onChange={(e) => setRowsInput(e.target.value)}
                    />
                </div>

                <div style={styles.buttons}>
                    <button style={styles.addButton} onClick={handleSubmit}>Построить</button>
                    <button style={styles.cancelButton} onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
}
