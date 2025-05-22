export async function rejectRequest(requestId) {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`https://localhost:8081/api/v1/registries/access-requests/${requestId}/reject`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
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