import { authFetch } from "../authFetch";
export async function rejectRequest(requestId) {
    try {
        const token = localStorage.getItem("access_token");
        const response = await authFetch(`/registries/access-requests/${requestId}/reject`, {
            method: "POST",
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error("Ошибка при отклонении запроса");
        }

        return true;
    } catch (error) {
        console.error("Ошибка при отклонении доступа:", error);
        return false;
    }
}