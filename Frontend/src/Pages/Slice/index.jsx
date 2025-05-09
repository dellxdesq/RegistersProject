import { useNavigate } from "react-router-dom";
import sliceStyles from "./styles";

const dummySlice = {
    name: "Срез 1",
    headers: ["ID", "Имя", "Дата", "Тип"],
    rows: Array.from({ length: 10 }, (_, i) => [
        `${i + 1}`,
        `Данные ${i + 1}`,
        `2023-0${(i % 12) + 1}-15`,
        i % 2 === 0 ? "A" : "B"
    ]),
};

export default function Slice() {
    const navigate = useNavigate();

    const handleDownload = () => {

        alert("Файл среза будет загружен");
    };

    return (
        <div style={sliceStyles.container}>
            <h2>{dummySlice.name}</h2>
            <table style={sliceStyles.table}>
                <thead>
                <tr>
                    {dummySlice.headers.map((header, index) => (
                        <th key={index} style={sliceStyles.th}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {dummySlice.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} style={sliceStyles.td}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <div style={sliceStyles.buttons}>
                <button onClick={() => navigate("/slices")} style={sliceStyles.backButton}>
                    Назад к срезам
                </button>
                <button onClick={handleDownload} style={sliceStyles.downloadButton}>
                Скачать
                </button>
            </div>
        </div>
    );
}
