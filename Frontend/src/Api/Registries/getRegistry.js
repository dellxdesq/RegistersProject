import { authFetch } from "../authFetch";

export async function fetchRegistries() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Токен отсутствует");
    }

    try {
        const response = await authFetch("/registries", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Ошибка загрузки реестров: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Ошибка при получении реестров:", error);
        throw error;
    }
}
