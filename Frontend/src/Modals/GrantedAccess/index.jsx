import { useState, useEffect } from "react";
import styles from "./styles";

export default function GrantedAccessModal({ isOpen, onClose }) {
    const [search, setSearch] = useState("");
    const [step, setStep] = useState("list");
    const [registries, setRegistries] = useState([]);
    const [selectedRegistry, setSelectedRegistry] = useState(null);
    const [users, setUsers] = useState([]);

    const dummyRegistries = [
        { id: 1, name: "Реестр недвижимости" },
        { id: 2, name: "Реестр транспорта" },
    ];

    const dummyUsers = [
        { id: 101, email: "ivan@example.com" },
        { id: 102, email: "anna@example.com" },
    ];

    useEffect(() => {
        if (isOpen) {
            setRegistries(dummyRegistries);
            setSearch("");
            setStep("list");
        }
    }, [isOpen]);

    const handleRegistryClick = (registry) => {
        setSelectedRegistry(registry);
        setUsers(dummyUsers);
        setSearch("");
        setStep("users");
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
