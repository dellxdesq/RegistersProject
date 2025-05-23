import { authFetch } from "../authFetch";
export async function grantAccessToUser(registryId, username) {
    const url = `/registries/${registryId}/users/access`;

    try {
        const response = await authFetch(url, {
            method: "POST",
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
