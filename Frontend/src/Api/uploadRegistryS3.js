import { authFetch } from "./authFetch";
export async function uploadRegistryFile(file, token) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await authFetch("/storage/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка при загрузке файла: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка загрузки реестра:", error);
        throw error;
    }
}
