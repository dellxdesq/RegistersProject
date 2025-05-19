import { useState, useEffect } from "react";
import { getUploadedAccessRegistries } from "../../Api/getAccessList";
import { getUsersWithAccess } from "../../Api/getUsersWithAccess";


import styles from "./styles";

export default function GrantedAccessModal({ isOpen, onClose }) {
    const [search, setSearch] = useState("");
    const [step, setStep] = useState("list");
    const [registries, setRegistries] = useState([]);
    const [selectedRegistry, setSelectedRegistry] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setSearch("");
            setStep("list");
            setSelectedRegistry(null);
            
            getUploadedAccessRegistries().then((res) => {
                if (res.success) {
                    setRegistries(res.data);
                } else {
                    console.error("Ошибка при получении реестров:", res.error);
                    setRegistries([]);
                }
            });
        }
    }, [isOpen]);
    

    useEffect(() => {
        if (isOpen) {
            setSearch("");
            setStep("list");
        }
    }, [isOpen]);

    const handleRegistryClick = async (registry) => {
        setSelectedRegistry(registry);
        setSearch("");
        setStep("users");

        const result = await getUsersWithAccess(registry.id);
        if (result.success) {
            const usersFromAPI = result.data.map((login, index) => ({
                id: index,
                email: login,
            }));
            setUsers(usersFromAPI);
        } else {
            alert("Не удалось загрузить пользователей: " + result.error);
            setUsers([]);
        }
    };

    const handleRemoveUser = (userId) => {
        setUsers(prev => prev.filter(user => user.id !== userId));
    };

    const handleAddUser = () => {
        const email = prompt("Введите email пользователя:");
        if (email) {
            const newUser = { id: Date.now(), email };
            setUsers(prev => [...prev, newUser]);
        }
    };

    const handleBack = () => {
        setStep("list");
        setSelectedRegistry(null);
        setSearch("");
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeButton} onClick={onClose}>×</button>
                {step === "list" && (
                    <>
                        <h3>Реестры с доступом</h3>
                        
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={styles.input}
                        />
                        <ul style={styles.list}>
                            {registries.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
                                .map(reg => (
                                    <li key={reg.id} style={styles.item} onClick={() => handleRegistryClick(reg)}>
                                        {reg.name}
                                    </li>
                                ))}
                        </ul>
                    </>
                )}
                {step === "users" && (
                    <>
                        <h3>Пользователи с доступом к <i>{selectedRegistry.name}</i></h3>
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={styles.input}
                        />
                        <ul style={styles.list}>
                            {users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()))
                                .map(user => (
                                    <li key={user.id} style={styles.item}>
                                        {user.email}
                                        <button style={styles.removeBtn} onClick={() => handleRemoveUser(user.id)}>×</button>
                                    </li>
                                ))}
                        </ul>
                        <div style={styles.buttons}>
                            <button style={styles.addButton} onClick={handleAddUser}>Добавить пользователя</button>
                            <button style={styles.cancelButton} onClick={handleBack}>Назад</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
