import { authFetch } from "../authFetch";

export async function fetchUserRegistries(userId) {
    const url = `/registries/user/${userId}`;

    try {
        const response = await authFetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Ошибка при получении реестров: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка запроса:", error);
        throw error;
    }
}
