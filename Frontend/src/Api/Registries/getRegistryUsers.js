export async function getRegistryUsernames(registryId) {
    try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(`https://localhost:8081/api/v1/registries/${registryId}/users/usernames`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`������ ��� ��������� �������������: ${response.statusText}`);
        }

        const usernames = await response.json();
        return { success: true, usernames };
    } catch (error) {
        console.error("������ ��� ��������� ������ �������������:", error);
        return { success: false, error: error.message };
    }
}
