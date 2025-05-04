export async function fetchUserRegistries(userId, token) {
    const url = `https://localhost:8081/api/v1/registries/user/${userId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`������ ��� ��������� ��������: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("������ �������:", error);
        throw error;
    }
}
