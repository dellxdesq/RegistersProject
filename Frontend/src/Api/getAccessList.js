import { getAuthHeaders } from "../Utils/getAuthHeaders";
import { authFetch } from "./authFetch";

export async function getUploadedAccessRegistries() {
    const url = "/registries/list/uploaded/acces-level/2-3";

    try {
        const response = await authFetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Ошибка при получении реестров: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Ошибка при запросе загруженных реестров с доступом 2 и 3:", error);
        return { success: false, error: error.message };
    }
}
