import { getAuthHeaders } from "../Utils/getAuthHeaders";
import { authFetch } from "./authFetch";

export async function deleteUserAccess(registryId, username) {
    try {
        const response = await authFetch(`/registries/${registryId}/users/access`, {
            method: "DELETE",
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
