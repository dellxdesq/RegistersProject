export async function requestRegistryAccess(registryId, message = "Дайте доступ") {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Нет токена. Авторизуйтесь.");
    }

    const response = await fetch(`https://localhost:8081/api/v1/registries/${registryId}/request-access`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Ошибка запроса доступа");
    }

    return await response.text();
}
