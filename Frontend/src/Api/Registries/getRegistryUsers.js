export async function getRegistryUsernames(registryId) {
    try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(`https://localhost:8081/api/v1/registries/${registryId}/users/usernames`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка при получении пользователей: ${response.statusText}`);
        }

        const usernames = await response.json();
        return { success: true, usernames };
    } catch (error) {
        console.error("Ошибка при получении списка пользователей:", error);
        return { success: false, error: error.message };
    }
}
