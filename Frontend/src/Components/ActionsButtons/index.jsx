import { useState } from "react";
import styles from "./styles";
import OpenSlices from "../../Modals/OpenSlices";
import CreateSliceModal from "../../Modals/CreateSlice";

export default function RegistryActions({ fileFormat }) {
    const [hovered, setHovered] = useState(null);
    const [isSlicesOpen, setIsSlicesOpen] = useState(false);
    const [isCreateSliceOpen, setIsCreateSliceOpen] = useState(false);

    const dummyHeaders = ["ID", "Имя", "Дата", "Тип"];

    const getButtonStyle = (index) => ({
        ...styles.button,
        ...(hovered === index ? styles.buttonHover : {})
    });

    const handleClick = (text) => {
        if (text === "Просмотр срезов") {
            setIsSlicesOpen(true);
        } else if (text === "Сделать срез") {
            setIsCreateSliceOpen(true);
        }
    };

    return (
        <>
            <div style={styles.actionsWrapper}>
                <div style={styles.status}>Доступ: Требуется запрос</div>
                <div style={styles.buttonGroup}>
                    {["Запросить доступ", "Сделать срез", "Сделать график", "Просмотр срезов"].map((text, index) => (
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
        </>
    );
}
