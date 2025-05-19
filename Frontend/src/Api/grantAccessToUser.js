import { getAuthHeaders } from "../Utils/getAuthHeaders";

export async function grantAccessToUser(registryId, username) {
    const url = `https://localhost:8081/api/v1/registries/${registryId}/users/access`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка при выдаче доступа: ${response.statusText}`);
        }

        return { success: true };
    } catch (error) {
        console.error("Ошибка при выдаче доступа пользователю:", error);
        return { success: false, error: error.message };
    }
}
