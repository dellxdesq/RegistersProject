import { getAuthHeaders } from "../Utils/getAuthHeaders";

export async function getUsersWithAccess(registryId) {
    const url = `https://localhost:8081/api/v1/registries/${registryId}/users/usernames`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Ошибка при получении пользователей: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Ошибка при получении пользователей реестра:", error);
        return { success: false, error: error.message };
    }
}

