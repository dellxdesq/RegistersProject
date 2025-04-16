import { useState } from "react";
import Navbar from "../../Components/Navbar";
import SearchList from "../../Components/SearchList";
import RegistersList from "../../Components/RegistersList";
import UploadModal from "../../Modals/UploadModal"
import styles from "./styles";

const mockData = Array.from({ length: 15 }, (_, i) => `Реестр ${i + 1}`);

export default function LoadedRegistersPage() {
    const [search, setSearch] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    
    const filteredList = mockData.filter(item =>
        item.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.uploadWrapper}>
                    <button style={styles.uploadButton} onClick={() => setModalOpen(true)}>Загрузить</button>
                    <UploadModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}/>
                </div>
                <SearchList value={search} onChange={setSearch} />
                <RegistersList items={filteredList} />
            </div>
        </div>
    );
}
