export async function getRequestedAccess() {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("https://localhost:8081/api/v1/registries/requests-access", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Ошибка при получении запросов");
        }

        const data = await response.json();
        return data.map(({ username, registryName, requestId }) => ({
            username,
            registryName,
            requestId
        }));
    } catch (error) {
        console.error("Ошибка:", error);
        return [];
    }
}
