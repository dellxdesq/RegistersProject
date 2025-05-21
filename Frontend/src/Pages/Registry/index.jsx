import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRegistryById } from "../../Api/getRegistryById";
import RegistryInfo from "../../Components/RegistryInfo";
import RegistryTable from "../../Components/RegistryTable";
import RegistryActions from "../../Components/ActionsButtons";
import Navbar from "../../Components/Navbar";
import styles from "./styles";

export default function RegistryPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadRegistry() {
            try {
                const data = await fetchRegistryById(id);
                setInfo({
                    name: data.name,
                    description: data.description,
                    fileFormat: data.meta?.fileFormat || "Не указано",
                    organization: data.meta?.organization || "Не указано",
                    rowsCount: data.meta?.rowsCount || 0,
                    defaultAccessLevel: data.defaultAccessLevel,
                });
            } catch (err) {
                console.error(err.message);
                if (err.message === "Нет доступа к реестру") {
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

    const data = {
        headers: ["ID", "Имя", "Дата", "Тип"],
        top: Array.from({ length: 5 }, (_, i) => [`${i}`, `Строка ${i}`, `2023-0${i + 1}-01`, "Тип A"]),
        bottom: Array.from({ length: 5 }, (_, i) => [`${95 + i}`, `Строка ${95 + i}`, `2023-1${i + 1}-01`, "Тип B"]),
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.title}>{info.name}</h1>
                <div style={styles.content}>
                    <RegistryInfo info={info} />
                    <RegistryTable data={data} />
                    <RegistryActions fileFormat="xlsx" registryId={id} />

                </div>
            </div>
        </div>
    );
}
