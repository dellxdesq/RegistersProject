import { useEffect, useState } from "react";
import styles from "./styles";
import OpenSlices from "../../Modals/OpenSlices";
import CreateSliceModal from "../../Modals/CreateSlice";
import ChartModal from "../../Modals/ChartModal";
import { downloadRegistry } from "../../Api/Registries/downloadRegistry";
import { requestRegistryAccess } from "../../Api/Accesses/requestRegistryAccess";
import { deleteAccessRequest } from "../../Api/Accesses/deleteAccessRequest";
import { getRequestedAccess } from "../../Api/Accesses/getRequestedAccess";
import { FaDownload, FaChartBar, FaSlidersH, FaEye, FaLock } from "react-icons/fa";
import {parseJwt} from "../../Utils/parseJwt";
import { getFullRegistryFile } from "../../Api/Registries/getFullRegistryData";

export default function RegistryActions({registryId, accessLevel, fileName }) {
    const [hovered, setHovered] = useState(null);
    const [isSlicesOpen, setIsSlicesOpen] = useState(false);
    const [isCreateSliceOpen, setIsCreateSliceOpen] = useState(false);
    const [isChartOpen, setIsChartOpen] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const [chartData, setChartData] = useState(null);

    const actions = [
        { text: "Запросить доступ", icon: <FaLock /> },
        { text: "Скачать", icon: <FaDownload /> },
        { text: "Сделать срез", icon: <FaSlidersH /> },
        { text: "Сделать график", icon: <FaChartBar /> },
        { text: "Просмотр срезов", icon: <FaEye /> },
    ];
    
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
            const token = localStorage.getItem("access_token");
            try {
                const fullData = await getFullRegistryFile(fileName, token);
                setChartData(fullData);
                setIsChartOpen(true);
            } catch (err) {
                alert("Ошибка загрузки данных для графика: " + err.message);
            }
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
                    {actions
                        .filter(a => !(accessLevel === 1 && a.text === "Запросить доступ"))
                        .map((action, index) => {
                            const isDisabled =
                                accessLevel === 2 &&
                                ["Скачать", "Сделать срез", "Сделать график"].includes(action.text);

                            return (
                                <button
                                    key={index}
                                    title={action.text}
                                    style={{
                                        ...getButtonStyle(index),
                                        ...(isDisabled ? styles.disabledButton : {}),
                                        ...styles.iconButton,
                                    }}
                                    onMouseEnter={() => setHovered(index)}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => !isDisabled && handleClick(action.text)}
                                    disabled={isDisabled}
                                >
                                    {action.icon}
                                </button>
                            );
                        })}
                </div>
            </div>

            <OpenSlices isOpen={isSlicesOpen} onClose={() => setIsSlicesOpen(false)}/>

            <CreateSliceModal
                isOpen={isCreateSliceOpen}
                onClose={() => setIsCreateSliceOpen(false)}
                headers={dummyHeaders}

            />
            <ChartModal
                isOpen={isChartOpen}
                onClose={() => setIsChartOpen(false)}
                headers={chartData?.columns || []}
                rows={chartData?.rows || []}
            />
        </>
    );
}
