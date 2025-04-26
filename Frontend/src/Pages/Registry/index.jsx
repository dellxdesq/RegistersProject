import { useParams } from "react-router-dom";
import RegistryInfo from "../../Components/RegistryInfo";
import RegistryTable from "../../Components/RegistryTable";
import RegistryActions from "../../Components/ActionsButtons";
import styles from "./styles";

export default function RegistryPage() {
    const { id } = useParams();

    const info = {
        name: `������ �${id}`,
        description: `�������� ������� �${id}`,
        fileFormat: "Excel",
        organization: "���������������",
        rowsCount: 6543,
        defaultAccessLevel: 3
    };

    const data = {
        headers: ["ID", "���", "����", "���"],
        top: Array.from({ length: 5 }, (_, i) => [`${i}`, `������ ${i}`, `2023-0${i + 1}-01`, "��� A"]),
        bottom: Array.from({ length: 5 }, (_, i) => [`${95 + i}`, `������ ${95 + i}`, `2023-1${i + 1}-01`, "��� B"]),
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{info.name}</h1>

            <RegistryInfo info={info} />
            <RegistryTable data={data} />
            <RegistryActions />
        </div>
    );
}
