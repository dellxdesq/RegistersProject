import { getAuthHeaders } from "../Utils/getAuthHeaders";
import { authFetch } from "./authFetch";
export async function getProfile() {
    try {
        const response = await authFetch("/auth/profile", {
            method: "GET",
            
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
