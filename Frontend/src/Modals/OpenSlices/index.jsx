import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import modalStyles from "./styles.js";
import { getSlicesByRegistry } from "../../Api/Slices/getSlicesByRegistry";

export default function OpenSlices({ isOpen, onClose, registryId }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [slices, setSlices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen || !registryId) return;

        setLoading(true);
        setError(null);
        const token = localStorage.getItem("access_token");

        getSlicesByRegistry(registryId, token)
            .then((data) => setSlices(data || []))
            .catch((err) => {
                console.error("Ошибка получения срезов:", err);
                setError("Не удалось загрузить срезы");
            })
            .finally(() => setLoading(false));
    }, [isOpen, registryId]);

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
                    filteredSlices.map(slice => {
                        let filters = [];
                        try {
                            const parsed = JSON.parse(slice.sliceDefinitionJson);
                            filters = parsed.Filters || [];
                        } catch (e) {
                            // ignore parse errors
                        }

                        return (
                            <div
                                key={slice.id}
                                style={modalStyles.listItem}
                                onClick={() => handleOpenSlice(slice.id)}
                            >
                                <strong>{slice.name || `Срез ${slice.id}`}</strong><br />
                                <small>Файл: {slice.fileName}</small><br />
                                {filters.length > 0 && (
                                    <small>
                                        Фильтры: {filters.map(f => `${f.Column} ${f.Op} ${f.Value}`).join(", ")}
                                    </small>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div style={{ color: "#999" }}>Нет срезов</div>
                )}

                <button onClick={onClose} style={modalStyles.closeButton}>Закрыть</button>
            </div>
        </div>
    );
}
