import { useState } from "react";
import { useNavigate } from "react-router-dom";
import modalStyles from "./styles.js";

export default function OpenSlices({ isOpen, onClose }) {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fakeSlices = [
        { id: 1, name: "Срез 1 (заглушка)" },
        { id: 2, name: "Срез 2 (заглушка)" },
        { id: 3, name: "Срез 3 (заглушка)" },
        { id: 4, name: "Срез 4 (заглушка)" },
        { id: 11, name: "Срез 5 (заглушка)" },
        { id: 12, name: "Срез 6 (заглушка)" },
        { id: 13, name: "Срез 7 (заглушка)" },
        { id: 33, name: "Срез 8 (заглушка)" },
    ];

    const filteredSlices = fakeSlices.filter(slice =>
        slice.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenSlice = (id) => {
        onClose();
        navigate(`/slice/${id}`);
    };

    if (!isOpen) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h3>Срезы</h3>
                <input
                    type="text"
                    placeholder="Поиск среза..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={modalStyles.search}
                />
                {filteredSlices.map(slice => (
                    <div
                        key={slice.id}
                        style={modalStyles.listItem}
                        onClick={() => handleOpenSlice(slice.id)}
                    >
                        {slice.name}
                    </div>
                ))}
                {filteredSlices.length === 0 && (
                    <div style={{ color: "#999" }}>Нет срезов</div>
                )}
                <button onClick={onClose} style={modalStyles.closeButton}>Закрыть</button>
            </div>
        </div>
    );
}
