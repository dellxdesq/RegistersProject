import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRegistryById } from "../../Api/Registries/getRegistryById";
import RegistryInfo from "../../Components/RegistryInfo";
import RegistryTable from "../../Components/RegistryTable";
import RegistryActions from "../../Components/ActionsButtons";
import Navbar from "../../Components/Navbar";
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
                });
                
                const preview = await getFilePreview(data.name + "." + data.meta.fileFormat,  token);
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
                    <RegistryInfo info={info} />
                    <RegistryTable data={tableData} />
                    <RegistryActions registryId={id} />

                </div>
            </div>
        </div>
    );
}
