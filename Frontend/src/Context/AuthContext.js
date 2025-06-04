import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../Api/Users/getUserProfileInfo";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Загружаем профиль, если токен есть
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            getProfile().then((res) => {
                if (res.success) {
                    const { username, firstName, lastName } = res.data;
                    setUser({ username, firstName, lastName });
                } else {
                    // Не удалось загрузить профиль, возможно токен устарел
                    logout();
                }
            });
        }
    }, []);

    const login = ({ token, refreshToken, username }) => {
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("username", username); // по желанию

        // Загружаем профиль сразу после логина
        getProfile().then((res) => {
            if (res.success) {
                const { firstName, lastName } = res.data;
                setUser({ username, firstName, lastName });
            } else {
                setUser({ username }); // fallback
            }
        });
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
