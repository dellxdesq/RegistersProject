import { getAuthHeaders } from "../Utils/getAuthHeaders"
export async function fetchRegistryById(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`https://localhost:8081/api/v1/registries/${id}`, {
        headers: getAuthHeaders(),
    });

    if (response.status === 403) {
        throw new Error("Нет доступа к реестру");
    }

    if (!response.ok) {
        throw new Error("Ошибка загрузки реестра");
    }

    const data = await response.json();
    return data;
}