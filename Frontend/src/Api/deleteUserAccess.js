import { getAuthHeaders } from "../Utils/getAuthHeaders";

export async function deleteUserAccess(registryId, username) {
    try {
        const response = await fetch(`https://localhost:8081/api/v1/registries/${registryId}/users/access`, {
            method: "DELETE",
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username })
        });

        if (!response.ok) {
            throw new Error(`Ошибка при удалении доступа: ${response.statusText}`);
        }

        return { success: true };
    } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        return { success: false, error: error.message };
    }
}
