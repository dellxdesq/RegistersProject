import { getAuthHeaders } from "../Utils/getAuthHeaders";

export async function getProfile() {
    try {
        const response = await fetch("https://localhost:8081/api/v1/auth/profile", {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Ошибка при получении профиля:", error);
        return { success: false, error: error.message };
    }
}
