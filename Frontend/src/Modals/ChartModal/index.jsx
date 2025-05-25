import { useState } from "react";
import styles from "./styles";

export default function ChartModal({ isOpen, onClose, headers, rows }) {
    const [selectedChartType, setSelectedChartType] = useState("line");
    const [xAxis, setXAxis] = useState("");
    const [yAxis, setYAxis] = useState("");
    const [rowsInput, setRowsInput] = useState("");

    const parseRowInput = (input) => {
        const parts = input.split(",");
        const result = new Set();
        parts.forEach(part => {
            if (part.includes("-")) {
                const [start, end] = part.split("-").map(n => parseInt(n.trim(), 10));
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= end; i++) result.add(i);
                }
            } else {
                const n = parseInt(part.trim(), 10);
                if (!isNaN(n)) result.add(n);
            }
        });
        return Array.from(result).filter(n => n >= 0 && n < rows.length);
    };

    const handleSubmit = () => {
        const rowNumbers = parseRowInput(rowsInput);
        const data = rowNumbers.map((rowIdx) => {
            const row = rows[rowIdx];
            const item = {};
            headers.forEach((header, i) => {
                const value = row[i];
                const number = parseFloat(value);
                item[header] = isNaN(number) ? value : number;
            });
            return item;
        });

        const chartParams = {
            type: selectedChartType,
            xAxis,
            yAxis,
            data
        };

        localStorage.setItem("chartData", JSON.stringify(chartParams));
        window.open("/chart-viewer", "_blank");
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeButton} onClick={onClose}>×</button>
                <h2>Построение графика</h2>

                <div style={styles.section}>
                    <label>Тип графика:</label>
                    <select style={styles.input} value={selectedChartType} onChange={(e) => setSelectedChartType(e.target.value)}>
                        <option value="line">Линейный</option>
                        <option value="bar">Столбчатый</option>
                        <option value="pie">Круговой</option>
                    </select>
                </div>

                {(selectedChartType !== "pie") && (
                    <>
                        <div style={styles.section}>
                            <label>Ось X:</label>
                            <select style={styles.input} value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                                <option value="">—</option>
                                {headers.map(header => (
                                    <option key={header} value={header}>{header}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.section}>
                            <label>Ось Y:</label>
                            <select style={styles.input} value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                                <option value="">—</option>
                                {headers.map(header => (
                                    <option key={header} value={header}>{header}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {selectedChartType === "pie" && (
                    <>
                        <div style={styles.section}>
                            <label>Значение:</label>
                            <select style={styles.input} value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                                <option value="">—</option>
                                {headers.map(header => (
                                    <option key={header} value={header}>{header}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.section}>
                            <label>Название (подписи):</label>
                            <select style={styles.input} value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                                <option value="">—</option>
                                {headers.map(header => (
                                    <option key={header} value={header}>{header}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <div style={styles.section}>
                    <p>Строки (напр. 1-5,7,10-12):</p>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="например: 1-5,7,10-12"
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
