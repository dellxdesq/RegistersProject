import { authFetch } from "./authFetch";
import {getAuthHeaders} from "../Utils/getAuthHeaders";

export async function uploadRegistryFile(file, token) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("https://localhost:8081/api/v1/storage/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
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
