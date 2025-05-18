import { getAuthHeaders } from "../Utils/getAuthHeaders";

export async function getUploadedRegistries() {
    try {
        const response = await fetch("https://localhost:8081/api/v1/registries/list/uploaded", {
            method: "GET",
            headers: getAuthHeaders()
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
