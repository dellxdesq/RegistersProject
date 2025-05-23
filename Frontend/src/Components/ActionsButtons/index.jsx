import { useEffect, useState } from "react";
import styles from "./styles";
import OpenSlices from "../../Modals/OpenSlices";
import CreateSliceModal from "../../Modals/CreateSlice";
import ChartModal from "../../Modals/ChartModal";
import { downloadRegistry } from "../../Api/Registries/downloadRegistry";
import { requestRegistryAccess } from "../../Api/Accesses/requestRegistryAccess";
import { deleteAccessRequest } from "../../Api/Accesses/deleteAccessRequest";
import { getRequestedAccess } from "../../Api/Accesses/getRequestedAccess";
import {parseJwt} from "../../Utils/parseJwt";

export default function RegistryActions({registryId }) {
    const [hovered, setHovered] = useState(null);
    const [isSlicesOpen, setIsSlicesOpen] = useState(false);
    const [isCreateSliceOpen, setIsCreateSliceOpen] = useState(false);
    const [isChartOpen, setIsChartOpen] = useState(false);
    const [requestId, setRequestId] = useState(null);

    const dummyHeaders = ["ID", "Имя", "Дата", "Тип"];

    useEffect(() => {
        const fetchRequestId = async () => {
            const token = localStorage.getItem("access_token");
            const tokenPayload = parseJwt(token);
            const userId = tokenPayload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

            const allRequests = await getRequestedAccess();
            console.log("все запросы:", allRequests);
            console.log("мой userId:", userId);

            console.log("allRequests:", allRequests);
            console.log("registryId:", registryId, "userId:", userId);

            const match = allRequests.find(req => {
                console.log("Проверка req:", req);
                return String(req.registryId) === String(registryId) && String(req.userId) === String(userId);
            });


            console.log("match найден:", match);

            if (match) {
                setRequestId(match.requestId);
            } else {
                setRequestId(null);
            }
        };

        fetchRequestId();
    }, [registryId]);



    const getButtonStyle = (index) => ({
        ...styles.button,
        ...(hovered === index ? styles.buttonHover : {})
    });

    const handleDeleteRequest = async () => {
        
        if (!requestId) return;
        try {
            const result = await deleteAccessRequest(requestId);
            if (result.success) {
                alert("Запрос удалён");
                setRequestId(null); 
            } else {
                alert("Ошибка при удалении: " + result.error);
            }
        } catch (e) {
            alert("Ошибка: " + e.message);
        }
    };

    const handleClick = async (text) => {
        if (text === "Просмотр срезов") {
            setIsSlicesOpen(true);
        } else if (text === "Сделать срез") {
            setIsCreateSliceOpen(true);
        } else if (text === "Сделать график") {
            setIsChartOpen(true);
        } else if (text === "Скачать") {
            const result = await downloadRegistry(registryId);
            if (!result.success) {
                alert("Ошибка при скачивании: " + result.error);
            }
        } else if (text === "Запросить доступ") {
            try {
                const responseText = await requestRegistryAccess(registryId, "Дайте доступ");
                alert(responseText);
            } catch (err) {
                alert("Ошибка: " + err.message);
            }
        }
    };

    return (
        <>
            <div style={styles.actionsWrapper}>
                <div style={styles.statusWrapper}>
                    <div style={styles.status}>Доступ: Требуется запрос</div>
                    {requestId && (
                        <button
                            style={styles.deleteRequestButton}
                            onClick={handleDeleteRequest}
                        >
                            Удалить запрос
                        </button>
                    )}
                </div>

                <div style={styles.buttonGroup}>
                    {["Запросить доступ", "Скачать", "Сделать срез", "Сделать график", "Просмотр срезов"].map((text, index) => (
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

            <CreateSliceModal
                isOpen={isCreateSliceOpen}
                onClose={() => setIsCreateSliceOpen(false)}
                headers={dummyHeaders}
                
            />
            <ChartModal
                isOpen={isChartOpen}
                onClose={() => setIsChartOpen(false)}
                headers={dummyHeaders}
            />
        </>
    );
}
