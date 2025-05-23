import { authFetch } from "../authFetch";
export async function requestRegistryAccess(registryId, message = "Дайте доступ") {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Нет токена. Авторизуйтесь.");
    }

    const response = await authFetch(`/registries/${registryId}/request-access`, {
        method: "POST",
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Ошибка запроса доступа");
    }

    return await response.text();
}
