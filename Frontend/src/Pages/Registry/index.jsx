import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRegistryById } from "../../Api/Registries/getRegistryById";
import RegistryInfo from "../../Components/RegistryInfo";
import RegistryTable from "../../Components/RegistryTable";
import RegistryActions from "../../Components/ActionsButtons";
import Navbar from "../../Components/Navbar";
import { getFullRegistryFile } from "../../Api/Registries/getFullRegistryData";
import { getFilePreview } from "../../Api/Registries/getRegistryDataPreview";
import styles from "./styles";

export default function RegistryPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tableData, setTableData] = useState(null);

    useEffect(() => {
        async function loadRegistry() {
            try {
                const token = localStorage.getItem('access_token');
                const data = await fetchRegistryById(id);

                setInfo({
                    name: data.name,
                    description: data.description,
                    fileFormat: data.meta?.fileFormat || "Не указано",
                    organization: data.meta?.organization || "Не указано",
                    rowsCount: data.meta?.rowsCount || 0,
                    defaultAccessLevel: data.defaultAccessLevel,
                    fileName: data.meta?.fileName || "",
                });

                const preview = await getFilePreview(data.meta.fileName, token);
                setTableData({
                    headers: preview.columns,
                    top: preview.firstRows,
                    bottom: preview.lastRows,
                });
            } catch (err) {
                console.error(err.message);
                if (err.message.includes("доступ")) {
                    navigate("/");
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        loadRegistry();
    }, [id, navigate]);

    const handleShowFull = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const fullData = await getFullRegistryFile(info.fileName, token);

            const newWindow = window.open("", "_blank");
            //надо бы это наверное поменять будет, но пока так работает все
            const htmlTable = `
                <html>
                <head>
                    <title>${fullData.fileName}</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; }
                    </style>
                </head>
                <body>
                    <h2>${fullData.fileName}</h2>
                    <table>
                        <thead>
                            <tr>${fullData.columns.map(col => `<th>${col}</th>`).join("")}</tr>
                        </thead>
                        <tbody>
                            ${fullData.rows.map(row => `
                                <tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>
                            `).join("")}
                        </tbody>
                    </table>
                </body>
                </html>
            `;
            newWindow.document.write(htmlTable);
            newWindow.document.close();
        } catch (err) {
            alert("Не удалось получить полный файл: " + err.message);
        }
    };

    if (loading) return <div>Загрузка реестра...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!info) return <div>Реестр не найден</div>;
    if (!tableData) return <div>Загрузка таблицы...</div>;

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.title}>{info.name}</h1>
                <div style={styles.content}>
                    <RegistryInfo info={info} onShowFull={handleShowFull} />
                    <RegistryTable data={tableData} />
                    <RegistryActions
                        registryId={id}
                        accessLevel={info.defaultAccessLevel}
                        fileName={info.fileName}
                    />
                </div>
            </div>
        </div>
    );
}
