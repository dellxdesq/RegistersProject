import { getAuthHeaders } from "../Utils/getAuthHeaders";
import { authFetch } from "./authFetch";

export async function getUploadedRegistries() {
    try {
        const response = await authFetch("/registries/list/uploaded", {
            method: "GET",
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: errorText || "Ошибка при получении загруженных реестров" };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Ошибка при получении загруженных реестров:", error);
        return { success: false, error: "Ошибка подключения к серверу" };
    }
}
