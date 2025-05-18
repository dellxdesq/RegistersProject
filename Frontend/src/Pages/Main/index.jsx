import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import SearchList from "../../Components/SearchList";
import RegistersList from "../../Components/RegistersList";
import UploadModal from "../../Modals/UploadModal";
import { validateToken } from "../../Api/validateAuth";
import { fetchRegistries } from "../../Api/getRegistry";
import { fetchUserRegistries } from "../../Api/getAvailableRegistries";
import { getUploadedRegistries } from "../../Api/getUploadedRegistries";
import styles from "./styles";

export default function MainPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialMode = location.state?.mode || "all";
    const [search, setSearch] = useState("");
    const [mode, setMode] = useState(initialMode);
    const [isModalOpen, setModalOpen] = useState(false);
    const [registries, setRegistries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (location.state?.mode) {
            setMode(location.state.mode);
        }
    }, [location.state]);

    useEffect(() => {
        async function loadRegistries() {
            try {
                const userData = JSON.parse(localStorage.getItem("user_data"));
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Пользователь не авторизован");
                    return;
                }

                let data = [];

                if (mode === "available") {
                    data = await fetchUserRegistries(userData.id, token);
                } else if (mode === "uploaded") {
                    const result = await getUploadedRegistries();
                    if (result.success) {
                        data = result.data;
                    } else {
                        console.error("Ошибка при получении загруженных реестров:", result.error);
                    }
                } else {
                    data = await fetchRegistries();
                }

                setRegistries(data);
            } catch (error) {
                console.error("Ошибка загрузки реестров:", error);
            } finally {
                setLoading(false);
            }
        }
        loadRegistries();
    }, [mode]);

    
    const getDataByMode = () => {
        switch (mode) {
            case "uploaded":
                return registries.filter(r => r.defaultAccessLevel === 2 || 1 || 3);
            case "available":
                return registries.filter(r => r.defaultAccessLevel === 3);
            case "all":
            default:
                return registries;
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
