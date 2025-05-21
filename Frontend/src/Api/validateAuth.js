import {getAuthHeaders} from "../Utils/getAuthHeaders";

export async function validateToken() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return { isValid: false, error: "Токен отсутствует" };
    }

    try {
        const response = await fetch("https://localhost:8081/api/v1/auth/validate", {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            if (errorText.includes("Invalid token")) {
                return { isValid: false, error: "Invalid token" };
            } else {
                throw new Error("Ошибка запроса: " + response.status);
            }
        }

        const data = await response.json();
        return {
            isValid: data.isValid,
            userId: data.userId,
        };

    } catch (error) {
        console.error("Ошибка при валидации токена:", error);
        return { isValid: false, error: error.message };
    }
}
