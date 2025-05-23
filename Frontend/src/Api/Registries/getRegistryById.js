import { authFetch } from "../authFetch";
export async function fetchRegistryById(id) {
    const token = localStorage.getItem("token");
    const response = await authFetch(`/registries/${id}`, {
        method: "GET",
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