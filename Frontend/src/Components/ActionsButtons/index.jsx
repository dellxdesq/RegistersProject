import { useState } from "react";
import styles from "./styles";
import OpenSlices from "../../Modals/OpenSlices"; // путь к модалке

export default function RegistryActions() {
    const [hovered, setHovered] = useState(null);
    const [isSlicesOpen, setIsSlicesOpen] = useState(false);

    const getButtonStyle = (index) => ({
        ...styles.button,
        ...(hovered === index ? styles.buttonHover : {})
    });

    const handleClick = (text) => {
        if (text === "Просмотр срезов") {
            setIsSlicesOpen(true);
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
        </>
    );

}
