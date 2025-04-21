import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import SearchList from "../../Components/SearchList";
import RegistersList from "../../Components/RegistersList";
import UploadModal from "../../Modals/UploadModal";
import styles from "./styles";

const mockData = Array.from({ length: 15 }, (_, i) => `Реестр ${i + 1}`);

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

    const filteredList = mockData.filter(item =>
        item.toLowerCase().includes(search.toLowerCase())
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
