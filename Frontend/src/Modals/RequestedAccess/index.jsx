import { useEffect, useState } from "react";
import styles from "./styles";
import { getRequestedAccess } from "../../Api/getRequestedAccess";
import { approveRequest } from "../../Api/approveRequest";
import {rejectRequest} from "../../Api/rejectRequest";

export default function RequestedAccessModal({ isOpen, onClose }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (isOpen) {
            getRequestedAccess().then(setRequests);
        }
    }, [isOpen]);

    const uniqueUsers = [...new Set(requests.map(r => r.username))];
    const registriesByUser = username => requests.filter(r => r.username === username);

    const handleApprove = async (requestId) => {
        const success = await approveRequest(requestId);
        if (success) {
            setRequests(prev => prev.filter(r => r.requestId !== requestId));
        }
    };

    const handleReject = async (requestId) => {
        const success = await rejectRequest(requestId);
        if (success) {
            setRequests(prev => prev.filter(r => r.requestId !== requestId));
        }
    };

    if (!isOpen) return null;
    
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeButton} onClick={onClose}>×</button>

                {!selectedUser ? (
                    <>
                        <h3>Выберите пользователя</h3>
                        <ul style={styles.list}>
                            {uniqueUsers.map((user, index) => (
                                <li key={index} style={styles.item} onClick={() => setSelectedUser(user)}>
                                    {user}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <>
                        <h3>Запросы пользователя: {selectedUser}</h3>
                        <ul style={styles.list}>
                            {registriesByUser(selectedUser).map((req, index) => (
                                <li key={index} style={styles.item}>
                                    {req.registryName}
                                    <div style={styles.buttons}>
                                        <button
                                            style={styles.addButton}
                                            onClick={() => handleApprove(req.requestId)}
                                        >
                                            Принять
                                        </button>
                                        <button
                                            style={styles.removeBtn}
                                            onClick={() => handleReject(req.requestId)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div style={styles.buttons}>
                            <button style={styles.cancelButton} onClick={() => setSelectedUser(null)}>Назад</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
