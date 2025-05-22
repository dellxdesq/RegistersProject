import { getAuthHeaders } from "../Utils/getAuthHeaders";
import { authFetch } from "./authFetch";

export async function downloadRegistry(registryId) {
    const url = `/registries/${registryId}/download`;

    try {
        const response = await authFetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Ошибка при скачивании: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.downloadUrl) {
            window.open(data.downloadUrl, "_blank");
            return { success: true };
        } else {
            throw new Error("Ссылка для скачивания не найдена.");
        }

    } catch (error) {
        console.error("Ошибка при скачивании:", error);
        return { success: false, error: error.message };
    }
}
