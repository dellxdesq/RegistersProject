export async function approveRequest(requestId) {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`https://localhost:8081/api/v1/registries/access-requests/${requestId}/approve`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Ошибка при подтверждении запроса");
        }

        return true;
    } catch (error) {
        console.error("Ошибка при подтверждении доступа:", error);
        return false;
    }
}