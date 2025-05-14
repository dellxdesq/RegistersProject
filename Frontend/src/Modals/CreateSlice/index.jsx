import { useState } from "react";
import styles from "./styles";

export default function CreateSlice({ isOpen, onClose, headers, fileFormat }) {
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [selectedRows, setSelectedRows] = useState("");
    const [conditions, setConditions] = useState({
        onlyEvenIDs: false,
        recentDates: false,
        typeAOnly: false,
        nameStartsWith: false
    });

    const [selectedKey, setSelectedKey] = useState("");
    const [dataRows, setDataRows] = useState("");

    const isStructuredFormat = ["json", "xml"].includes(fileFormat?.toLowerCase());

    if (!isOpen) return null;

    const toggleCondition = (condition) => {
        setConditions((prev) => ({ ...prev, [condition]: !prev[condition] }));
    };

    const handleCreate = () => {
        if (isStructuredFormat) {
            alert(`Срез создан по ключу "${selectedKey}" с данными:\n${dataRows}`);
        } else {
            alert("Срез создан");
        }
        onClose();
    };

    const handleColumnChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedColumns(selected);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Создание среза</h2>

                {!isStructuredFormat ? (
                    <>
                        <label style={styles.label}>Выбор столбцов:</label>
                        <select
                            multiple
                            value={selectedColumns}
                            onChange={handleColumnChange}
                            style={styles.selectMultiple}
                        >
                            {headers.map((header, idx) => (
                                <option key={idx} value={header}>{header}</option>
                            ))}
                        </select>

                        <label style={styles.label}>Выбор строк (номера через запятую):</label>
                        <input
                            type="text"
                            value={selectedRows}
                            onChange={(e) => setSelectedRows(e.target.value)}
                            style={styles.input}
                        />

                        <div style={styles.conditionsWrapper}>
                            <label><input type="checkbox" checked={conditions.onlyEvenIDs} onChange={() => toggleCondition("onlyEvenIDs")} /> Только с чётными ID</label>
                            <label><input type="checkbox" checked={conditions.recentDates} onChange={() => toggleCondition("recentDates")} /> Только с недавними датами</label>
                            <label><input type="checkbox" checked={conditions.typeAOnly} onChange={() => toggleCondition("typeAOnly")} /> Только тип A</label>
                            <label><input type="checkbox" checked={conditions.nameStartsWith} onChange={() => toggleCondition("nameStartsWith")} /> Имя начинается с "Д"</label>
                        </div>
                    </>
                ) : (
                    <>
                        <label style={styles.label}>Выберите ключ:</label>
                        <select
                            value={selectedKey}
                            onChange={(e) => setSelectedKey(e.target.value)}
                            style={styles.input}
                        >
                            <option value="">-- Выберите ключ --</option>
                            {headers.map((header, idx) => (
                                <option key={idx} value={header}>{header}</option>
                            ))}
                        </select>

                        <label style={styles.label}>Вставьте строки данных:</label>
                        <textarea
                            value={dataRows}
                            onChange={(e) => setDataRows(e.target.value)}
                            placeholder="Введите данные, например JSON/XML строки"
                            style={{ ...styles.input, height: "100px", resize: "vertical" }}
                        />
                    </>
                )}

                <div style={styles.buttons}>
                    <button onClick={handleCreate} style={styles.createButton}>Сделать срез</button>
                    <button onClick={onClose} style={styles.closeButton}>Закрыть</button>
                </div>
            </div>
        </div>
    );
}

