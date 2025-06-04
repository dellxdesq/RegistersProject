import { useEffect, useState } from "react";
import styles from "./styles";
import { getFullRegistryFile } from "../../Api/Registries/getFullRegistryData";
import { previewSlice } from "../../Api/Slices/previewSlice";
import { saveSliceToDB } from "../../Api/Slices/saveSlice";
import { viewSlice } from "../../Api/Slices/viewSlice";
import { confirmSlice } from "../../Api/Slices/confirmSlice";

const filterOps = ["=", "!=", ">", "<", ">=", "<="];

export default function CreateSlice({ isOpen, onClose, fileFormat, fileName, registerId }) {
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [filters, setFilters] = useState([]);
    const [columns, setColumns] = useState([]);
    const [limit, setLimit] = useState(10);
    const [selectedKey, setSelectedKey] = useState("");
    const [dataRows, setDataRows] = useState("");

    const isStructuredFormat = ["json", "xml"].includes(fileFormat?.toLowerCase());
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        if (isOpen && fileName && token) {
            getFullRegistryFile(fileName, token)
                .then((data) => {
                    setColumns(data.columns || []);
                    setFilters([{ column: "", op: "=", value: "" }]);
                })
                .catch((err) => console.error("Ошибка загрузки колонок:", err));
        }
    }, [isOpen, fileName, token]);

    if (!isOpen) return null;

    const handleFilterChange = (index, field, value) => {
        const newFilters = [...filters];
        newFilters[index][field] = value;
        setFilters(newFilters);
    };

    const addFilter = () => {
        setFilters([...filters, { column: "", op: "=", value: "" }]);
    };

    const removeFilter = (index) => {
        const newFilters = filters.filter((_, i) => i !== index);
        setFilters(newFilters);
    };

    const handleCreate = async () => {
        try {
            const payload = buildSlicePayload();
            
            const previewResponse = await previewSlice(fileName, payload);
            const sliceFileName = previewResponse.sliceFileName;

            if (!sliceFileName) throw new Error("sliceFileName не получен");
            
            const saveResponse = await saveSliceToDB(registerId, {
                name: "Срез", 
                fileName: sliceFileName,
                request: {
                    Columns: payload.columns,
                    filters: payload.filters,
                    limit: payload.limit
                }
            });

            const sliceId = saveResponse;
            
            const result = await viewSlice(sliceFileName);
            
            await confirmSlice(sliceFileName);

            alert(`Срез создан (ID: ${sliceId}). Предпросмотр: ${JSON.stringify(result)}`);
            onClose();

        } catch (err) {
            console.error("Ошибка создания среза:", err);
            alert("Не удалось создать срез");
        }
    };


    const handleColumnChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedColumns(selected);
    };

    const buildSlicePayload = () => {
        if (isStructuredFormat) {
            return {
                columns: [selectedKey],
                filters: dataRows
                    .split("\n")
                    .map(line => ({ column: selectedKey, op: "=", value: line.trim() }))
                    .filter(item => item.value),
                limit: limit || 10
            };
        } else {
            return {
                columns: selectedColumns,
                filters: filters
                    .filter(f => f.column && f.op && f.value)
                    .map(f => ({ column: f.column, op: f.op, value: f.value })),
                limit: limit || 10
            };
        }
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
                            {columns.map((header, idx) => (
                                <option key={idx} value={header}>{header}</option>
                            ))}
                        </select>

                        <label style={styles.label}>Фильтры:</label>
                        {filters.map((filter, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                <select
                                    value={filter.column}
                                    onChange={(e) => handleFilterChange(idx, "column", e.target.value)}
                                    style={styles.input}
                                >
                                    <option value="">Колонка</option>
                                    {columns.map((col, i) => (
                                        <option key={i} value={col}>{col}</option>
                                    ))}
                                </select>

                                <select
                                    value={filter.op}
                                    onChange={(e) => handleFilterChange(idx, "op", e.target.value)}
                                    style={styles.input}
                                >
                                    {filterOps.map((op, i) => (
                                        <option key={i} value={op}>{op}</option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    value={filter.value}
                                    onChange={(e) => handleFilterChange(idx, "value", e.target.value)}
                                    placeholder="Значение"
                                    style={styles.input}
                                />

                                <button onClick={() => removeFilter(idx)} style={styles.closeButton}>✕</button>
                            </div>
                        ))}
                        <button onClick={addFilter} style={styles.createButton}>Добавить фильтр</button>

                        <label style={styles.label}>Лимит строк:</label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            style={styles.input}
                        />
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
                            {columns.map((header, idx) => (
                                <option key={idx} value={header}>{header}</option>
                            ))}
                        </select>

                        <label style={styles.label}>Вставьте строки данных:</label>
                        <textarea
                            value={dataRows}
                            onChange={(e) => setDataRows(e.target.value)}
                            placeholder="Введите строки данных"
                            style={{ ...styles.input, height: "100px", resize: "vertical" }}
                        />

                        <label style={styles.label}>Лимит строк:</label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            style={styles.input}
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
