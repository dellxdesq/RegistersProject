import { authFetch } from "../authFetch";

export async function getUsersWithAccess(registryId) {
    const url = `/registries/${registryId}/users/usernames`;

    try {
        const response = await authFetch(url, {
            method: "GET",
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

