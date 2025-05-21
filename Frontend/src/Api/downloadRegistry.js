import { getAuthHeaders } from "../Utils/getAuthHeaders";

export async function downloadRegistry(registryId) {
    const url = `https://localhost:8081/api/v1/registries/${registryId}/download`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders()
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
