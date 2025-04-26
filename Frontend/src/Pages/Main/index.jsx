import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import SearchList from "../../Components/SearchList";
import RegistersList from "../../Components/RegistersList";
import UploadModal from "../../Modals/UploadModal";
import styles from "./styles";

const allData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Общий реестр ${i + 1}`
}));

const uploadedData = Array.from({ length: 6 }, (_, i) => ({
    id: i + 101,
    name: `Загруженный ${i + 1}`
}));

const availableData = Array.from({ length: 8 }, (_, i) => ({
    id: i + 201,
    name: `Доступный ${i + 1}`
}));

export default function MainPage() {
    const location = useLocation();
    const initialMode = location.state?.mode || "all";
    const [search, setSearch] = useState("");
    const [mode, setMode] = useState(initialMode);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (location.state?.mode) {
            setMode(location.state.mode);
        }
    }, [location.state]);

    const getDataByMode = () => {
        switch (mode) {
            case "uploaded":
                return uploadedData;
            case "available":
                return availableData;
            case "all":
            default:
                return allData;
        }
    };

    const filteredList = getDataByMode().filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                {mode === "uploaded" && (
                    <div style={styles.uploadWrapper}>
                        <button style={styles.uploadButton} onClick={() => setModalOpen(true)}>
                            Загрузить
                        </button>
                        <UploadModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
                    </div>
                )}

                <SearchList value={search} onChange={setSearch} />
                <RegistersList items={filteredList} />
            </div>
        </div>
    );
}
