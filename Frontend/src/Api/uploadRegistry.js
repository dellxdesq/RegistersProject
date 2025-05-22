import { authFetch } from "./authFetch";
import { getAuthHeaders } from "../Utils/getAuthHeaders"
export async function addRegistry(data, token) {
    try {
        const response = await authFetch('/registries/add', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при добавлении реестра');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка отправки реестра:', error);
        throw error;
    }
}
