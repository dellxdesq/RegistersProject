import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import modalStyles from "./styles.js";
import { viewSlice } from "../../Api/Slices/viewSlice";


export default function OpenSlices({ isOpen, onClose, fileName }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [slices, setSlices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen || !fileName) return;

        setLoading(true);
        setError(null);
        const token = localStorage.getItem("access_token");

        getAllSlices(fileName, token)
            .then((data) => setSlices(data || []))
            .catch((err) => {
                console.error("Ошибка получения срезов:", err);
                setError("Не удалось загрузить срезы");
            })
            .finally(() => setLoading(false));
    }, [isOpen, fileName]);

    const filteredSlices = slices.filter(slice =>
        slice.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={modalStyles.search}
                />

                {loading ? (
                    <div>Загрузка...</div>
                ) : error ? (
                    <div style={{ color: "red" }}>{error}</div>
                ) : filteredSlices.length > 0 ? (
                    filteredSlices.map(slice => (
                        <div
                            key={slice.id}
                            style={modalStyles.listItem}
                            onClick={() => handleOpenSlice(slice.id)}
                        >
                            {slice.name || `Срез ${slice.id}`}
                        </div>
                    ))
                ) : (
                    <div style={{ color: "#999" }}>Нет срезов</div>
                )}

                <button onClick={onClose} style={modalStyles.closeButton}>Закрыть</button>
            </div>
        </div>
    );
}
