export async function fetchRegistries() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Токен отсутствует");
    }

    try {
        const response = await fetch("https://localhost:8081/api/v1/registries", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
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
