import {useState, useEffect, use} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import SearchList from "../../Components/SearchList";
import RegistersList from "../../Components/RegistersList";
import UploadModal from "../../Modals/UploadModal";
import { validateToken } from "../../Api/validateAuth";
import { fetchRegistries } from "../../Api/getRegistry";
import { fetchUserRegistries } from "../../Api/getAvailableRegistries";
import { getUploadedRegistries } from "../../Api/getUploadedRegistries";
import { parseJwt } from "../../Utils/parseJwt";

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
                const token = localStorage.getItem("access_token");
                const tokenPayload = parseJwt(token);
                
                const userId = tokenPayload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

                if (!token || !userId) {
                    console.error("Не удалось извлечь userId или токен");
                    return;
                }

                let data = [];

                if (mode === "available") {
                    data = await fetchUserRegistries(userId);
                    console.log(userId);
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

                console.log("Полученные реестры:", data);
                setRegistries(data);
            } catch (error) {
                console.error("Ошибка загрузки реестров:", error);
            } finally {
                setLoading(false);
            }
        }

        loadRegistries();
    }, [mode]);

    //тут это почистить вообще надо, но пока используется в filteredList, поэтому пусть будет
    const getDataByMode = () => {
        switch (mode) {
            case "uploaded":
                return registries;
            case "available":
                return registries;
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
