import { useState } from "react";
import styles from "../ActionsButtons";

export default function RegistryActions() {
    const [hovered, setHovered] = useState(null);

    const getButtonStyle = (index) => ({
        ...styles.button,
        ...(hovered === index ? styles.buttonHover : {})
    });

    return (
        <div style={styles.actionsWrapper}>
            <div style={styles.status}>������: ��������� ������</div>
            <div style={styles.buttonGroup}>
                {["��������� ������", "������� ����", "������� ������"].map((text, index) => (
                    <button
                        key={index}
                        style={getButtonStyle(index)}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {text}
                    </button>
                ))}
            </div>
        </div>
    );
}
