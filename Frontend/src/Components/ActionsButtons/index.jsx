import { useState } from "react";
import styles from "./styles";
import OpenSlices from "../../Modals/OpenSlices";
import CreateSliceModal from "../../Modals/CreateSlice";
import { downloadRegistry } from "../../Api/downloadRegistry";
import { requestRegistryAccess } from "../../Api/requestRegistryAccess";
import ChartModal from "../../Modals/ChartModal";


export default function RegistryActions({ fileFormat, registryId }) {
    const [hovered, setHovered] = useState(null);
    const [isSlicesOpen, setIsSlicesOpen] = useState(false);
    const [isCreateSliceOpen, setIsCreateSliceOpen] = useState(false);
    const [isChartOpen, setIsChartOpen] = useState(false);
    const dummyHeaders = ["ID", "Имя", "Дата", "Тип"];

    const getButtonStyle = (index) => ({
        ...styles.button,
        ...(hovered === index ? styles.buttonHover : {})
    });

    const handleClick = async (text) => {
        if (text === "Просмотр срезов") {
            setIsSlicesOpen(true);
        } else if (text === "Сделать срез") {
            setIsCreateSliceOpen(true);
        } else if (text === "Сделать график") {
            setIsChartOpen(true);
        } else if (text === "Скачать") {
            const result = await downloadRegistry(registryId);
            if (!result.success) {
                alert("Ошибка при скачивании: " + result.error);
            }
        } else if (text === "Запросить доступ") {
            try {
                const responseText = await requestRegistryAccess(registryId, "Дайте доступ");
                alert(responseText);
            } catch (err) {
                alert("Ошибка: " + err.message);
            }
        }
    };


    return (
        <>
            <div style={styles.actionsWrapper}>
                <div style={styles.status}>Доступ: Требуется запрос</div>
                <div style={styles.buttonGroup}>
                    {["Запросить доступ", "Скачать", "Сделать срез", "Сделать график", "Просмотр срезов"].map((text, index) => (
                        <button
                            key={index}
                            style={getButtonStyle(index)}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => handleClick(text)}
                        >
                            {text}
                        </button>
                    ))}
                </div>
            </div>

            <OpenSlices isOpen={isSlicesOpen} onClose={() => setIsSlicesOpen(false)} />

            <CreateSliceModal
                isOpen={isCreateSliceOpen}
                onClose={() => setIsCreateSliceOpen(false)}
                headers={dummyHeaders}
                fileFormat={fileFormat}
            />
            <ChartModal
                isOpen={isChartOpen}
                onClose={() => setIsChartOpen(false)}
                headers={dummyHeaders}
            />
        </>
    );
}
